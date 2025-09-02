using EmployeeManagementSystem.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
namespace EmployeeManagementSystem.Repositories
{
    public interface ILeaveRepository : IGenericRepository<Leave>
    {
        Task<IEnumerable<Leave>> GetByEmployeeAsync(int employeeId);
        Task<IEnumerable<Leave>> GetByStatusAsync(string status);
        Task<bool> UpdateStatusAsync(int leaveId, string status);
    }
}
