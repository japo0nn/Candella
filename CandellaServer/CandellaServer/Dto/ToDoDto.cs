using CandellaServer.Data;
using CandellaServer.Dto.Abstract;

namespace CandellaServer.Dto
{
    public class ToDoDto : MainDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public bool isComplete { get; set; } = false;
        public bool isStarted { get; set; } = false;
        public double latitude { get; set; }
        public double longitude { get; set; }

        public Guid? ClientId { get; set; }
        public ClientDto Client { get; set; }
        public Guid? DepartmentId { get; set; }
        public DepartmentDto Department { get; set; }
        public Guid? EmployeeId { get; set; }
        public EmployeeDto Employee { get; set; }
    }
}
