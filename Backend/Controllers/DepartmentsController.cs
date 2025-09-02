using EmployeeManagementSystem.DTOs;
using EmployeeManagementSystem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagementSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        private readonly IDepartmentService _departments;

        public DepartmentsController(IDepartmentService departments) => _departments = departments;

        // GET: /api/departments
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _departments.GetAllAsync();
            return Ok(list.Select(d => new { d.DepartmentId, d.DepartmentName }));
        }

        // GET: /api/departments/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var d = await _departments.GetByIdAsync(id);
            return d is null ? NotFound() : Ok(new { d.DepartmentId, d.DepartmentName });
        }

        // POST: /api/departments
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _departments.CreateAsync(dto.DepartmentName.Trim());
            return Ok(new { created.DepartmentId, created.DepartmentName }); // ✅ return 200 with object
        }

        // PUT: /api/departments/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateDepartmentDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (id != dto.DepartmentId) return BadRequest("Mismatched DepartmentId.");

            var existing = await _departments.GetByIdAsync(id);
            if (existing is null) return NotFound();

            existing.DepartmentName = dto.DepartmentName.Trim();
            await _departments.UpdateAsync(existing);

            // ✅ Return updated object (not just NoContent) so frontend gets fresh data
            return Ok(new { existing.DepartmentId, existing.DepartmentName });
        }

        // DELETE: /api/departments/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _departments.GetByIdAsync(id);
            if (existing is null) return NotFound();

            await _departments.DeleteAsync(id);

            // ✅ Return deleted id so frontend can remove it from state
            return Ok(new { deletedId = id });
        }
    }
}
