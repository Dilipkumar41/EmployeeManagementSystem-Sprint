using EmployeeManagementSystem.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleService _roles;
        public RolesController(IRoleService roles) => _roles = roles;

        // GET: /api/roles
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _roles.GetAllAsync();
            return Ok(list.Select(r => new { r.RoleId, r.RoleName }));
        }

        // (Optional) GET: /api/roles/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var role = await _roles.GetByIdAsync(id);
            return role is null ? NotFound() : Ok(new { role.RoleId, role.RoleName });
        }
    }
}
