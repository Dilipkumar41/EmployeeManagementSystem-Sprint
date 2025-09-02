using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Repositories
{
    public class EmployeeRepository : GenericRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(EmployeeManagementDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<Employee>> GetAllWithDetailsAsync()
                   => await _db.AsNoTracking()
                               .Include(e => e.User)
                               .Include(e => e.Department)
                               .Include(e => e.Manager)
                               .ToListAsync();

        public Task<Employee?> GetByIdWithDetailsAsync(int id)
            => _db.AsNoTracking()
                  .Include(e => e.User)
                  .Include(e => e.Department)
                  .Include(e => e.Manager)
                  .FirstOrDefaultAsync(e => e.EmployeeId == id);

        public async Task<IEnumerable<Employee>> GetByDepartmentAsync(int departmentId)
            => await _db.AsNoTracking()
                        .Where(e => e.DepartmentId == departmentId)
                        .Include(e => e.User)
                        .Include(e => e.Department)
                        .ToListAsync();

        public async Task<IEnumerable<Employee>> GetTeamForManagerAsync(int managerId)
            => await _db.AsNoTracking()
                        .Where(e => e.ManagerId == managerId)
                        .Include(e => e.User)
                        .Include(e => e.Department)
                        .ToListAsync();
    }
}
