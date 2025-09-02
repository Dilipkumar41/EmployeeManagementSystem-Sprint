using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementSystem.DTOs
{
    public class ApplyLeaveDto
    {
        [Required] public int EmployeeId { get; set; }
        [Required] public DateTime StartDate { get; set; }
        [Required] public DateTime EndDate { get; set; }
        [MaxLength(255)] public string? Reason { get; set; }
    }

    public class UpdateLeaveStatusDto
    {
        [Required] public string Status { get; set; } = "Pending"; // Pending/Approved/Rejected
    }
}
