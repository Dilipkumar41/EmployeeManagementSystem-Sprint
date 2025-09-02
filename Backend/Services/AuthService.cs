using EmployeeManagementSystem.Repositories;
using EmployeeManagementSystem.Services.Interfaces;
using EmployeeManagementSystem.Utilities;


namespace EmployeeManagementSystem.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IRoleRepository _roles;
        private readonly IJwtTokenService _jwt;

        public AuthService(IUserRepository users, IRoleRepository roles, IJwtTokenService jwt)
        {
            _users = users;
            _roles = roles;
            _jwt = jwt;
        }

        public async Task<(bool ok, int userId, string email, int roleId, string token, string error)> RegisterAsync(string email, string password, int roleId)
        {
            if (await _users.ExistsByEmailAsync(email))
                return (false, 0, "", 0, "", "Email already registered.");

            var role = await _roles.GetByIdAsync(roleId);
            if (role is null)
                return (false, 0, "", 0, "", "Invalid roleId.");

            var passwordHash = PasswordHasher.Hash(password);

            var user = await _users.AddAsync(new Models.User
            {
                Email = email.Trim(),
                PasswordHash = passwordHash,
                RoleId = roleId,
                CreatedAt = DateTime.Now
            });

            var token = _jwt.Generate(user, role.RoleName);
            return (true, user.UserId, user.Email, user.RoleId, token, "");
        }

        public async Task<(bool ok, int userId, string email, int roleId, string token, string error)> LoginAsync(string email, string password)
        {
            var user = await _users.GetByEmailAsync(email);
            if (user is null) return (false, 0, "", 0, "", "Invalid credentials.");

            if (!PasswordHasher.Verify(password, user.PasswordHash))
                return (false, 0, "", 0, "", "Invalid credentials.");

            // role is required by our schema (FK not null)
            var roleName = user.Role?.RoleName ?? "Employee";
            var token = _jwt.Generate(user, roleName);

            return (true, user.UserId, user.Email, user.RoleId, token, "");
        }
    }
}
