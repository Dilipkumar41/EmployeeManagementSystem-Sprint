using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.Models;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Repositories;

namespace EmployeeManagementSystem.Repositories
{
    public class LeaveRepository : GenericRepository<Leave>, ILeaveRepository
    {
        public LeaveRepository(EmployeeManagementDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Leave>> GetByEmployeeAsync(int employeeId)
            => await _db.AsNoTracking()
                        .Where(l => l.EmployeeId == employeeId)
                        .Include(l => l.Employee)
                            .ThenInclude(e => e!.User)
                        .ToListAsync();

        public async Task<IEnumerable<Leave>> GetByStatusAsync(string status)
            => await _db.AsNoTracking()
                        .Where(l => l.Status == status)
                        .Include(l => l.Employee)
                            .ThenInclude(e => e!.User)
                        .ToListAsync();

        public Task<IEnumerable<Leave>> GetByStstusAsync(string status)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateStatusAsync(int leaveId, string status)
        {
            var leave = await _db.FirstOrDefaultAsync(l => l.LeaveId == leaveId);
            if (leave == null) return false;

            leave.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
