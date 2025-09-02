using EmployeeManagementSystem.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _users;
        private readonly IRoleService _roles;

        public UsersController(IUserService users, IRoleService roles)
        {
            _users = users;
            _roles = roles;
        }

        // GET: /api/users
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // ✅ Use GetAllWithRolesAsync to ensure roles are included
            var list = await _users.GetAllWithRolesAsync();
            return Ok(list.Select(u => new
            {
                u.UserId,
                u.Email,
                u.RoleId,
                roleName = u.Role?.RoleName,
                u.CreatedAt
            }));
        }

        // GET: /api/users/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            // ✅ Use GetByIdWithRoleAsync to ensure role is included
            var u = await _users.GetByIdWithRoleAsync(id);
            if (u is null) return NotFound();

            return Ok(new
            {
                u.UserId,
                u.Email,
                u.RoleId,
                roleName = u.Role?.RoleName,
                u.CreatedAt
            });
        }

        // PUT: /api/users/{id}/role
        [HttpPut("{id:int}/role")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] int roleId)
        {
            var user = await _users.GetByIdWithRoleAsync(id);
            if (user is null) return NotFound();

            // Ensure the role exists
            var role = await _roles.GetByIdAsync(roleId);
            if (role is null) return BadRequest(new { message = "Invalid roleId" });

            user.RoleId = roleId;
            await _users.UpdateAsync(user);

            return Ok(new
            {
                user.UserId,
                user.Email,
                user.RoleId,
                roleName = role.RoleName,
                user.CreatedAt
            });
        }

        // DELETE: /api/users/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _users.DeleteAsync(id);
            return NoContent();
        }
    }
}
