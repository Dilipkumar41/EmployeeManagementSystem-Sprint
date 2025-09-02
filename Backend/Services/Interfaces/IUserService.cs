using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);

        /// <summary>
        /// Creates a user. PasswordHash must be a pre-hashed string (we’ll plug real hashing in Step 5).
        /// </summary>
        Task<User> CreateAsync(string email, string passwordHash, int roleId);

        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
        Task<IEnumerable<User>> GetAllWithRolesAsync();
        Task<User?> GetByIdWithRoleAsync(int id);


    }
}
