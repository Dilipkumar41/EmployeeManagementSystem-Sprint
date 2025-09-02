using System.Text.Json.Serialization;

namespace EmployeeManagementSystem.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        [JsonIgnore] public string PasswordHash { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public Role? Role { get; set; }

        // Keep inverse nav; we’ll map it as 1:1 in DbContext
        [JsonIgnore]
        public Employee? Employee { get; set; }
    }
}
