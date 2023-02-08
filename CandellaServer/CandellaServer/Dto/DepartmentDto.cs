using CandellaServer.Data;
using CandellaServer.Dto.Abstract;

namespace CandellaServer.Dto
{
    public class DepartmentDto : MainDto
    {
        public string Name { get; set; }

        public Guid DirectorId { get; set; }
        
    }
}
