using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace EmployeeManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;

        public AuthController(IAuthService auth) => _auth = auth;

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (ok, userId, email, roleId, token, error) = await _auth.RegisterAsync(dto.Email, dto.Password, dto.RoleId);
            if (!ok) return BadRequest(new { message = error });

            return Ok(new { userId, email, roleId, token });
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var (ok, userId, email, roleId, token, error) = await _auth.LoginAsync(dto.Email, dto.Password);
            if (!ok) return Unauthorized(new { message = error });

            return Ok(new { userId, email, roleId, token });
        }
    }
}
