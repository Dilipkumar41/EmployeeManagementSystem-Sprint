using System.Text.Json.Serialization;

namespace EmployeeManagementSystem.Models
{
    public class Employee
    {
        public int EmployeeId { get; set; }
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? Gender { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public DateTime HireDate { get; set; } = DateTime.Now;
        public string? JobTitle { get; set; }
        public int? DepartmentId { get; set; }
        public int? ManagerId { get; set; }

        // Navigation
        public User User { get; set; } = null!;
        public Department? Department { get; set; }
        [JsonIgnore] public Employee? Manager { get; set; }
        [JsonIgnore] public ICollection<Employee> Subordinates { get; set; } = new List<Employee>();
        public ICollection<Leave> Leaves { get; set; } = new List<Leave>();
    }
}
