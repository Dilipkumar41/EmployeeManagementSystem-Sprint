using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employees;

        public EmployeesController(IEmployeeService employees) => _employees = employees;

        // GET: /api/employees
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] bool details = true)
        {
            var list = await _employees.GetAllAsync(details);
            if (details)
            {
                return Ok(list.Select(e => new {
                    e.EmployeeId,
                    e.FirstName,
                    e.LastName,
                    e.Gender,
                    e.DateOfBirth,
                    e.HireDate,
                    e.JobTitle,
                    e.DepartmentId,
                    e.ManagerId,
                    User = e.User is null ? null : new { e.User.UserId, e.User.Email, e.User.RoleId },
                    Department = e.Department is null ? null : new { e.Department.DepartmentId, e.Department.DepartmentName }
                }));
            }
            return Ok(list);
        }

        // GET: /api/employees/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id, [FromQuery] bool details = true)
        {
            var emp = await _employees.GetByIdAsync(id, details);
            if (emp is null) return NotFound();

            if (details)
            {
                return Ok(new
                {
                    emp.EmployeeId,
                    emp.FirstName,
                    emp.LastName,
                    emp.Gender,
                    emp.DateOfBirth,
                    emp.HireDate,
                    emp.JobTitle,
                    emp.DepartmentId,
                    emp.ManagerId,
                    User = emp.User is null ? null : new { emp.User.UserId, emp.User.Email, emp.User.RoleId },
                    Department = emp.Department is null ? null : new { emp.Department.DepartmentId, emp.Department.DepartmentName }
                });
            }
            return Ok(emp);
        }

        // GET: /api/employees/department/{departmentId}
        [HttpGet("department/{departmentId:int}")]
        public async Task<IActionResult> GetByDepartment(int departmentId)
        {
            var list = await _employees.GetByDepartmentAsync(departmentId);
            return Ok(list.Select(e => new { e.EmployeeId, e.FirstName, e.LastName, e.JobTitle, e.DepartmentId }));
        }

        // GET: /api/employees/manager/{managerId}
        [HttpGet("manager/{managerId:int}")]
        public async Task<IActionResult> GetTeamForManager(int managerId)
        {
            var list = await _employees.GetTeamForManagerAsync(managerId);
            return Ok(list.Select(e => new { e.EmployeeId, e.FirstName, e.LastName, e.JobTitle, e.ManagerId }));
        }

        // POST: /api/employees
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEmployeeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var emp = new Employee
            {
                UserId = dto.UserId,
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Gender = dto.Gender,
                DateOfBirth = dto.DateOfBirth,
                JobTitle = dto.JobTitle,
                DepartmentId = dto.DepartmentId,
                ManagerId = dto.ManagerId
            };

            var created = await _employees.CreateAsync(emp);
            return CreatedAtAction(nameof(GetById), new { id = created.EmployeeId }, new
            {
                created.EmployeeId,
                created.UserId,
                created.FirstName,
                created.LastName,
                created.Gender,
                created.DateOfBirth,
                created.HireDate,
                created.JobTitle,
                created.DepartmentId,
                created.ManagerId,
                User = new { created.User.UserId, created.User.Email, created.User.RoleId },
                Department = created.Department is null ? null : new
                {
                    created.Department.DepartmentId,
                    created.Department.DepartmentName
                }
            });
        
        }

        // PUT: /api/employees/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateEmployeeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != dto.EmployeeId) return BadRequest("Mismatched EmployeeId.");

            var existing = await _employees.GetByIdAsync(id, false);
            if (existing is null) return NotFound();

            existing.UserId = dto.UserId;
            existing.FirstName = dto.FirstName.Trim();
            existing.LastName = dto.LastName.Trim();
            existing.Gender = dto.Gender;
            existing.DateOfBirth = dto.DateOfBirth;
            if (dto.HireDate.HasValue) existing.HireDate = dto.HireDate.Value;
            existing.JobTitle = dto.JobTitle;
            existing.DepartmentId = dto.DepartmentId;
            existing.ManagerId = dto.ManagerId;

            await _employees.UpdateAsync(existing);
            return NoContent();
        }

        // DELETE: /api/employees/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _employees.DeleteAsync(id);
            return NoContent();
        }
    }
}
