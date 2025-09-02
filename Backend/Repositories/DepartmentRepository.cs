using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementSystem.Repositories
{
    public class DepartmentRepository : GenericRepository<Department>, IDepartmentRepository
    {
        public DepartmentRepository(EmployeeManagementDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Department>> GetAllWithEmployeesAsync()
            => await _db.AsNoTracking()
            .Include(d => d.Employees)
            .ToListAsync();

        public Task<Department?> GetByNameAsync(string departmentName)
            => _db.AsNoTracking().FirstOrDefaultAsync(d => d.DepartmentName == departmentName);
    }
}
