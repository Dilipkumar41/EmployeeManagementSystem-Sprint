using EmployeeManagementSystem.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace EmployeeManagementSystem.Repositories
{
    public interface IDepartmentRepository : IGenericRepository<Department>
    {
        Task<Department?> GetByNameAsync(string departmentName);
        Task<IEnumerable<Department>> GetAllWithEmployeesAsync();
    }
}
