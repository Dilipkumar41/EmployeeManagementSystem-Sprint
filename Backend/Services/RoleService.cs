using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;
using EmployeeManagementSystem.Services.Interfaces;

namespace EmployeeManagementSystem.Services
{
    public class RoleService : IRoleService
    {
        private readonly IRoleRepository _roles;
        public RoleService(IRoleRepository roles) => _roles = roles;

        public Task<IEnumerable<Role>> GetAllAsync() => _roles.GetAllAsync();
        public Task<Role?> GetByIdAsync(int id) => _roles.GetByIdAsync(id);
        public Task<Role?> GetByNameAsync(string name) => _roles.GetByNameAsync(name);

        public async Task<Role> CreateAsync(Role role)
        {
            // simple unique check (DB also has unique index)
            var existing = await _roles.GetByNameAsync(role.RoleName);
            if (existing != null) throw new InvalidOperationException("Role name already exists.");
            return await _roles.AddAsync(role);
        }

        public Task UpdateAsync(Role role) => _roles.UpdateAsync(role);
        public Task DeleteAsync(int id) => _roles.DeleteAsync(id);
    }
}
