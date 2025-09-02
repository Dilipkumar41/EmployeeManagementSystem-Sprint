using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.DTOs
{
    public class CreateEmployeeDto
    {
        [Required] public int UserId { get; set; }
        [Required, MaxLength(100)] public string FirstName { get; set; } = string.Empty;
        [Required, MaxLength(100)] public string LastName { get; set; } = string.Empty;

        [MaxLength(10)] public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }

        [MaxLength(100)] public string? JobTitle { get; set; }
        public int? DepartmentId { get; set; }
        public int? ManagerId { get; set; }
    }

    public class UpdateEmployeeDto : CreateEmployeeDto
    {
        [Required] public int EmployeeId { get; set; }
        public DateTime? HireDate { get; set; } // optional to allow preserving existing
    }

}
