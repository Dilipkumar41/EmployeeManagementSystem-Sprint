using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Services.Interfaces
{
    public interface ILeaveService
    {
        Task<IEnumerable<Leave>> GetAllAsync();
        Task<Leave?> GetByIdAsync(int id);
        Task<IEnumerable<Leave>> GetByEmployeeAsync(int employeeId);
        Task<IEnumerable<Leave>> GetByStatusAsync(string status);

        Task<Leave> ApplyAsync(int employeeId, DateTime startDate, DateTime endDate, string? reason);
        Task<bool> UpdateStatusAsync(int leaveId, string status); // "Pending","Approved","Rejected"
        Task DeleteAsync(int id);
    }
}
