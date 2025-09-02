namespace EmployeeManagementSystem.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(bool ok, int userId, string email, int roleId, string token, string error)> LoginAsync(string email, string password);
        Task<(bool ok, int userId, string email, int roleId, string token, string error)> RegisterAsync(string email, string password, int roleId);

    }
}
