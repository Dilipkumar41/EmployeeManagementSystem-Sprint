using EmployeeManagementSystem.Models;
using EmployeeManagementSystem.Repositories;
using EmployeeManagementSystem.Services.Interfaces;

namespace EmployeeManagementSystem.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly IDepartmentRepository _departments;

        public DepartmentService(IDepartmentRepository departments) => _departments = departments;

        public Task<IEnumerable<Department>> GetAllAsync() => _departments.GetAllAsync();
        public Task<Department?> GetByIdAsync(int id) => _departments.GetByIdAsync(id);
        public Task<Department?> GetByNameAsync(string name) => _departments.GetByNameAsync(name);

        public async Task<Department> CreateAsync(string departmentName)
        {
            if (string.IsNullOrWhiteSpace(departmentName))
                throw new ArgumentException("Department name is required.");

            var existing = await _departments.GetByNameAsync(departmentName.Trim());
            if (existing != null)
                throw new InvalidOperationException("Department name already exists.");

            var dept = new Department { DepartmentName = departmentName.Trim() };
            return await _departments.AddAsync(dept);
        }

        public Task UpdateAsync(Department department) => _departments.UpdateAsync(department);
        public Task DeleteAsync(int id) => _departments.DeleteAsync(id);
    }
}
