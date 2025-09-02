using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;
using EmployeeManagementSystem.Services.Interfaces;

namespace EmployeeManagementSystem.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _employees;
        private readonly IUserRepository _users;
        private readonly IDepartmentRepository _departments;

        public EmployeeService(
            IEmployeeRepository employees,
            IUserRepository users,
            IDepartmentRepository departments)
        {
            _employees = employees;
            _users = users;
            _departments = departments;
        }

        public Task<IEnumerable<Employee>> GetAllAsync(bool withDetails = false)
            => withDetails ? _employees.GetAllWithDetailsAsync() : _employees.GetAllAsync();

        public Task<Employee?> GetByIdAsync(int id, bool withDetails = true)
            => withDetails ? _employees.GetByIdWithDetailsAsync(id) : _employees.GetByIdAsync(id);

        public Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId)
            => _employees.GetByDepartmentAsync(departmentId);

        public Task<IEnumerable<Employee>> GetTeamForManagerAsync(int managerId)
            => _employees.GetTeamForManagerAsync(managerId);

        public async Task<Employee> CreateAsync(Employee employee)
        {
            // Required: valid user
            var user = await _users.GetByIdAsync(employee.UserId);
            if (user is null) throw new ArgumentException("Invalid UserId.");

            // Optional: DepartmentId
            if (employee.DepartmentId.HasValue)
            {
                var dept = await _departments.GetByIdAsync(employee.DepartmentId.Value);
                if (dept is null) throw new ArgumentException("Invalid DepartmentId.");
            }

            // Optional: ManagerId
            if (employee.ManagerId.HasValue)
            {
                var mgr = await _employees.GetByIdAsync(employee.ManagerId.Value);
                if (mgr is null) throw new ArgumentException("Invalid ManagerId.");
            }

            // Basic name checks
            if (string.IsNullOrWhiteSpace(employee.FirstName))
                throw new ArgumentException("FirstName is required.");
            if (string.IsNullOrWhiteSpace(employee.LastName))
                throw new ArgumentException("LastName is required.");

            return await _employees.AddAsync(employee);
        }

        public async Task UpdateAsync(Employee employee)
        {
            // Validate optional/required fields similarly to Create
            if (employee.UserId <= 0) throw new ArgumentException("Invalid UserId.");
            if (string.IsNullOrWhiteSpace(employee.FirstName)) throw new ArgumentException("FirstName is required.");
            if (string.IsNullOrWhiteSpace(employee.LastName)) throw new ArgumentException("LastName is required.");

            if (employee.DepartmentId.HasValue)
            {
                var dept = await _departments.GetByIdAsync(employee.DepartmentId.Value);
                if (dept is null) throw new ArgumentException("Invalid DepartmentId.");
            }

            if (employee.ManagerId.HasValue)
            {
                if (employee.ManagerId == employee.EmployeeId)
                    throw new ArgumentException("ManagerId cannot be the same as EmployeeId.");

                var mgr = await _employees.GetByIdAsync(employee.ManagerId.Value);
                if (mgr is null) throw new ArgumentException("Invalid ManagerId.");
            }

            await _employees.UpdateAsync(employee);
        }

        // public Task DeleteAsync(int id) => _employees.DeleteAsync(id);
        public async Task DeleteAsync(int id)
        {
            // 1. Clear subordinates
            var subs = await _employees.GetTeamForManagerAsync(id);
            foreach (var sub in subs)
            {
                sub.ManagerId = null;
                await _employees.UpdateAsync(sub);
            }

            // 2. Delete employee itself
            await _employees.DeleteAsync(id);
        }

    }
}
