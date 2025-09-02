using EmployeeManagementSystem.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
namespace EmployeeManagementSystem.Repositories
{
    public interface IEmployeeRepository : IGenericRepository<Employee>
    {
        Task<IEnumerable<Employee>> GetAllWithDetailsAsync();
        Task<Employee?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId);
        Task<IEnumerable<Employee>> GetTeamForManagerAsync(int ManagerId);
    }
}
