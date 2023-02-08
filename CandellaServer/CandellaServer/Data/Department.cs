using CandellaServer.Data.Abstract;

namespace CandellaServer.Data
{
    public class Department : Entity
    {
        public string Name { get; set; }

        public Guid DirectorId { get; set; }
        public Director Director { get; set; }

        public List<Employee> Employees { get; set; }
        public List<ToDo> ToDoList { get; set; }
    }
}
