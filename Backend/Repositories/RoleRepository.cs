using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Repositories
{
    public class RoleRepository : GenericRepository<Role>, IRoleRepository
    {
        public RoleRepository(EmployeeManagementDbContext context) : base(context)
        {
        }

        public Task<Role?> GetByNameAsync(string roleName)
            => _db.AsNoTracking().FirstOrDefaultAsync(r => r.RoleName == roleName);
    }
}
