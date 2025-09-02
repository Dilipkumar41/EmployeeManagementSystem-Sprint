using System.Collections.Generic;
using System.Threading.Tasks;
using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;
using EmployeeManagementSystem.Services.Interfaces;

namespace EmployeeManagementSystem.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;
        private readonly IRoleRepository _roles;

        public UserService(IUserRepository users, IRoleRepository roles)
        {
            _users = users;
            _roles = roles;
        }

        public Task<IEnumerable<User>> GetAllAsync() => _users.GetAllAsync();
        public Task<User?> GetByIdAsync(int id) => _users.GetByIdAsync(id);
        public Task<User?> GetByEmailAsync(string email) => _users.GetByEmailAsync(email);

        // ✅ Use _users instead of _repo
        public async Task<IEnumerable<User>> GetAllWithRolesAsync()
            => await _users.GetAllWithRolesAsync();

        public async Task<User?> GetByIdWithRoleAsync(int id)
            => await _users.GetByIdWithRoleAsync(id);

        public async Task<User> CreateAsync(string email, string passwordHash, int roleId)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new ArgumentException("Email is required.");
            if (string.IsNullOrWhiteSpace(passwordHash)) throw new ArgumentException("PasswordHash is required.");

            if (await _users.ExistsByEmailAsync(email))
                throw new InvalidOperationException("Email already registered.");

            var role = await _roles.GetByIdAsync(roleId);
            if (role is null) throw new ArgumentException("Invalid roleId.");

            var user = new User
            {
                Email = email.Trim(),
                PasswordHash = passwordHash,
                RoleId = roleId,
                CreatedAt = DateTime.Now
            };

            return await _users.AddAsync(user);
        }

        public Task UpdateAsync(User user) => _users.UpdateAsync(user);
        public Task DeleteAsync(int id) => _users.DeleteAsync(id);
    }
}
