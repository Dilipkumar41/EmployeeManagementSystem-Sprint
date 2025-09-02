using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Services.Interfaces
{
    public interface IEmployeeService
    {
        Task<IEnumerable<Employee>> GetAllAsync(bool withDetails = false);
        Task<Employee?> GetByIdAsync(int id, bool withDetails = true);
        Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId);
        Task<IEnumerable<Employee>> GetTeamForManagerAsync(int managerId);

        Task<Employee> CreateAsync(Employee employee);
        Task UpdateAsync(Employee employee);
        Task DeleteAsync(int id);
    }
}
