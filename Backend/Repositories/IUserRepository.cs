using EmployeeManagementSystem.Models;
using System.Threading.Tasks;
namespace EmployeeManagementSystem.Repositories
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByNameAsync(string email);
        Task<bool> ExistsByEmailAsync(string email);
        Task<User?> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllWithRolesAsync();
        Task<User?> GetByIdWithRoleAsync(int id);
    }
}
