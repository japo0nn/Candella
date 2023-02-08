using CandellaServer.Data.Abstract;

namespace CandellaServer.Data
{
    public class ToDo : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool isComplete { get; set; } = false;
        public bool isStarted { get; set; } = false;
        public double latitude { get; set; }
        public double longitude { get; set; }
        public Guid ClientId { get; set; }
        public Client Client { get; set; }

        public Guid? DepartmentId { get; set; }
        public Department Department { get; set; }

        public Guid? EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}
