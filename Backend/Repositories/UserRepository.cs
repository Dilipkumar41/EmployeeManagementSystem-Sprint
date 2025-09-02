using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Repositories
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(EmployeeManagementDbContext context) : base(context)
        {
        }

        public Task<bool> ExistsByEmailAsync(string email)
            => _db.AsNoTracking().AnyAsync(u => u.Email == email);

        public Task<User?> GetByEmailAsync(string email)
        {
            return _db.AsNoTracking()
                      .Include(u => u.Role)
                      .FirstOrDefaultAsync(u => u.Email == email);
        }

        public Task<User?> GetByNameAsync(string email)
            => _db.AsNoTracking()
                  .Include(u => u.Role)
                  .FirstOrDefaultAsync(u => u.Email == email);

        // ✅ Custom method for all users with roles
        public async Task<IEnumerable<User>> GetAllWithRolesAsync()
        {
            return await _db.Include(u => u.Role).ToListAsync();
        }

        // ✅ Custom method for single user with role
        public async Task<User?> GetByIdWithRoleAsync(int id)
        {
            return await _db.Include(u => u.Role)
                            .FirstOrDefaultAsync(u => u.UserId == id);
        }
    }
}
