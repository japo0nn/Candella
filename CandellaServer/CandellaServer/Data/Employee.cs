using CandellaServer.Data.Abstract;

namespace CandellaServer.Data
{
    public class Employee : User
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
        public Guid? DepartmentId { get; set; }
        public Department Department { get; set; }

        public List<ToDo> ToDoList { get; set; }
    }
}
