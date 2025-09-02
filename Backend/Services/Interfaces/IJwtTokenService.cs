using EmployeeManagementSystem.Models;

namespace EmployeeManagementSystem.Services.Interfaces
{
    public interface IJwtTokenService
    {
        string Generate(User user, string roleName);
    }
}
