namespace EmployeeManagementSystem.Models
{
    public class Leave
    {
        public int LeaveId { get; set; }
        public int EmployeeId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; } = "Pending"; //Pending , Approved, Rejected
        public DateTime RequestedAt { get; set; } = DateTime.Now;

        //Navigation
        public Employee Employee { get; set; } = null!;
    }
}

