using CandellaServer.Data;
using CandellaServer.Dto.Abstract;

namespace CandellaServer.Dto
{
    public class EmployeeDto : MainDto
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }
        public Guid DepartmentId { get; set; }
    }
}
