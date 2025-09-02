using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.DTOs
{
    public class CreateDepartmentDto
    {
        [Required, MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;
    }

    public class UpdateDepartmentDto
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required, MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;
    }
}
