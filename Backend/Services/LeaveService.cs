using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;
using EmployeeManagementSystem.Services.Interfaces;

namespace EmployeeManagementSystem.Services
{
    public class LeaveService : ILeaveService
    {
        private readonly ILeaveRepository _leaves;
        private readonly IEmployeeRepository _employees;

        public LeaveService(ILeaveRepository leaves, IEmployeeRepository employees)
        {
            _leaves = leaves;
            _employees = employees;
        }

        public async Task<IEnumerable<Leave>> GetAllAsync() => await _leaves.GetAllAsync();
        public Task<Leave?> GetByIdAsync(int id) => _leaves.GetByIdAsync(id);
        public Task<IEnumerable<Leave>> GetByEmployeeAsync(int employeeId) => _leaves.GetByEmployeeAsync(employeeId);
        public Task<IEnumerable<Leave>> GetByStatusAsync(string status) => _leaves.GetByStatusAsync(status);

        public async Task<Leave> ApplyAsync(int employeeId, DateTime startDate, DateTime endDate, string? reason)
        {
            // Basic validations
            if (startDate.Date > endDate.Date)
                throw new ArgumentException("StartDate cannot be after EndDate.");

            var emp = await _employees.GetByIdAsync(employeeId);
            if (emp is null) throw new ArgumentException("Invalid EmployeeId.");

            // (Optional) Prevent overlaps: employee cannot have another overlapping leave
            var existingLeaves = await _leaves.GetByEmployeeAsync(employeeId);
            foreach (var l in existingLeaves)
            {
                // overlap if (start <= existing.End && end >= existing.Start)
                if (startDate.Date <= l.EndDate.Date && endDate.Date >= l.StartDate.Date)
                    throw new InvalidOperationException("Leave dates overlap with an existing leave.");
            }

            var leave = new Leave
            {
                EmployeeId = employeeId,
                StartDate = startDate.Date,
                EndDate = endDate.Date,
                Reason = reason,
                Status = "Pending",
                RequestedAt = DateTime.Now
            };

            return await _leaves.AddAsync(leave);
        }

        public async Task<bool> UpdateStatusAsync(int leaveId, string status)
        {
            status = status?.Trim() ?? "";
            if (status != "Pending" && status != "Approved" && status != "Rejected")
                throw new ArgumentException("Status must be Pending, Approved, or Rejected.");

            return await _leaves.UpdateStatusAsync(leaveId, status);
        }

        public Task DeleteAsync(int id) => _leaves.DeleteAsync(id);
    }
}
