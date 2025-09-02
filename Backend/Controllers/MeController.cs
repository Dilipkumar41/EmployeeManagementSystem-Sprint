using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using EmployeeManagementSystem.Data;

namespace EmployeeManagementSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeController : ControllerBase
{
    private readonly EmployeeManagementDbContext _context;

    public MeController(EmployeeManagementDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetProfile()
    {
        // ✅ Use ClaimTypes.NameIdentifier (set in JwtTokenService)
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim)) return Unauthorized();
        if (!int.TryParse(userIdClaim, out var userId)) return Unauthorized();

        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Employee!)
                .ThenInclude(e => e.Department)
            .Include(u => u.Employee!)
                .ThenInclude(e => e.Manager)
            .Include(u => u.Employee!)
                .ThenInclude(e => e.Leaves)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user is null) return NotFound(new { message = "User not found" });

        return Ok(new
        {
            user.UserId,
            user.Email,
            user.CreatedAt, // ✅ Added CreatedAt
            Role = user.Role?.RoleName,
            Employee = user.Employee == null ? null : new
            {
                user.Employee.EmployeeId,
                user.Employee.FirstName,
                user.Employee.LastName,
                user.Employee.Gender,
                user.Employee.DateOfBirth,
                user.Employee.HireDate,
                user.Employee.JobTitle,
                Department = user.Employee.Department == null ? null : new
                {
                    user.Employee.Department.DepartmentId,
                    user.Employee.Department.DepartmentName
                },
                Manager = user.Employee.Manager == null ? null : new
                {
                    user.Employee.Manager.EmployeeId,
                    user.Employee.Manager.FirstName,
                    user.Employee.Manager.LastName
                },
                Leaves = user.Employee.Leaves?.Select(l => new
                {
                    l.LeaveId,
                    l.StartDate,
                    l.EndDate,
                    l.Reason,
                    l.Status,
                    l.RequestedAt
                })
            }
        });
    }
}
