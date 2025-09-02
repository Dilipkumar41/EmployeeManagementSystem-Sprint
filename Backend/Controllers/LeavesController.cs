using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EmployeeManagementSystem.Data;
using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Models;
using System.Security.Claims;

namespace EmployeeManagementSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeavesController(EmployeeManagementDbContext context) : ControllerBase
{
    private readonly EmployeeManagementDbContext _context = context;

    // GET: /api/leaves
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? status = null, [FromQuery] int? employeeId = null)
    {
        var query = _context.Leaves
            .Include(l => l.Employee!)
                .ThenInclude(e => e.Department)
            .Include(l => l.Employee!)
                .ThenInclude(e => e.Manager)
            .AsQueryable();

        if (employeeId.HasValue)
            query = query.Where(l => l.EmployeeId == employeeId.Value);

        if (!string.IsNullOrWhiteSpace(status))
            query = query.Where(l => l.Status == status);

        var leaves = await query.ToListAsync();

        return Ok(leaves.Select(l => new
        {
            l.LeaveId,
            l.EmployeeId,
            l.StartDate,
            l.EndDate,
            l.Reason,
            l.Status,
            l.RequestedAt,
            Employee = l.Employee == null ? null : new
            {
                l.Employee.EmployeeId,
                l.Employee.FirstName,
                l.Employee.LastName,
                l.Employee.JobTitle,
                Department = l.Employee.Department == null ? null : new
                {
                    l.Employee.DepartmentId,
                    l.Employee.Department.DepartmentName  // ✅ correct path
                },
                Manager = l.Employee.Manager == null ? null : new
                {
                    l.Employee.Manager.EmployeeId,
                    l.Employee.Manager.FirstName,
                    l.Employee.Manager.LastName
                }
            }
        }));
    }

    // GET: /api/leaves/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var leave = await _context.Leaves
            .Include(l => l.Employee!)
                .ThenInclude(e => e.Department)
            .Include(l => l.Employee!)
                .ThenInclude(e => e.Manager)
            .FirstOrDefaultAsync(l => l.LeaveId == id);

        if (leave is null) return NotFound(new { message = "Leave not found" });

        return Ok(new
        {
            leave.LeaveId,
            leave.EmployeeId,
            leave.StartDate,
            leave.EndDate,
            leave.Reason,
            leave.Status,
            leave.RequestedAt,
            Employee = leave.Employee == null ? null : new
            {
                leave.Employee.EmployeeId,
                leave.Employee.FirstName,
                leave.Employee.LastName,
                leave.Employee.JobTitle,
                Department = leave.Employee.Department == null ? null : new
                {
                    leave.Employee.DepartmentId,
                    leave.Employee.Department.DepartmentName  // ✅ correct path
                },
                Manager = leave.Employee.Manager == null ? null : new
                {
                    leave.Employee.Manager.EmployeeId,
                    leave.Employee.Manager.FirstName,
                    leave.Employee.Manager.LastName
                }
            }
        });
    }

    // POST: /api/leaves
    [HttpPost]
    public async Task<IActionResult> Apply([FromBody] ApplyLeaveDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var leave = new Leave
        {
            EmployeeId = dto.EmployeeId,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            Reason = dto.Reason,
            Status = "Pending",
            RequestedAt = DateTime.UtcNow
        };

        _context.Leaves.Add(leave);
        await _context.SaveChangesAsync();

        leave = await _context.Leaves
            .Include(l => l.Employee!)
                .ThenInclude(e => e.Department)
            .FirstAsync(l => l.LeaveId == leave.LeaveId);

        return CreatedAtAction(nameof(GetById), new { id = leave.LeaveId }, new
        {
            leave.LeaveId,
            leave.EmployeeId,
            leave.StartDate,
            leave.EndDate,
            leave.Reason,
            leave.Status,
            leave.RequestedAt,
            Employee = leave.Employee == null ? null : new
            {
                leave.Employee.EmployeeId,
                leave.Employee.FirstName,
                leave.Employee.LastName,
                leave.Employee.JobTitle,
                Department = leave.Employee.Department == null ? null : new
                {
                    leave.Employee.DepartmentId,
                    leave.Employee.Department.DepartmentName  // ✅ correct path
                }
            }
        });
    }

    // PUT: /api/leaves/{id}/status
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateLeaveStatusDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (string.IsNullOrWhiteSpace(dto.Status)) return BadRequest(new { message = "Status is required" });

        var leave = await _context.Leaves.FindAsync(id);
        if (leave is null) return NotFound(new { message = "Leave not found" });

        leave.Status = dto.Status.Trim();
        await _context.SaveChangesAsync();

        leave = await _context.Leaves
            .Include(l => l.Employee!)
                .ThenInclude(e => e.Department)
            .Include(l => l.Employee!)
                .ThenInclude(e => e.Manager)
            .FirstAsync(l => l.LeaveId == id);

        var actedBy = new
        {
            userId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            email = User.FindFirstValue(ClaimTypes.Email),
            role = User.FindFirstValue(ClaimTypes.Role)
        };

        return Ok(new
        {
            leave.LeaveId,
            leave.EmployeeId,
            leave.StartDate,
            leave.EndDate,
            leave.Reason,
            leave.Status,
            leave.RequestedAt,
            Employee = leave.Employee == null ? null : new
            {
                leave.Employee.EmployeeId,
                leave.Employee.FirstName,
                leave.Employee.LastName,
                leave.Employee.JobTitle,
                Department = leave.Employee.Department == null ? null : new
                {
                    leave.Employee.DepartmentId,
                    leave.Employee.Department.DepartmentName  // ✅ correct path
                },
                Manager = leave.Employee.Manager == null ? null : new
                {
                    leave.Employee.Manager.EmployeeId,
                    leave.Employee.Manager.FirstName,
                    leave.Employee.Manager.LastName
                }
            },
            actedBy,
            updatedAt = DateTime.UtcNow
        });
    }

    // DELETE: /api/leaves/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var leave = await _context.Leaves.FindAsync(id);
        if (leave is null) return NotFound(new { message = "Leave not found" });

        _context.Leaves.Remove(leave);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}  
