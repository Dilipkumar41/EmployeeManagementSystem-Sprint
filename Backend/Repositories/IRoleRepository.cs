using EmployeeManagementSystem.Models;
using System.Threading.Tasks;
namespace EmployeeManagementSystem.Repositories
{
    public interface IRoleRepository : IGenericRepository<Role>
    {
        Task<Role?> GetByNameAsync(string roleName);
    }
}
