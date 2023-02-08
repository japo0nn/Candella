using CandellaServer.Data;
using CandellaServer.Dto.Abstract;

namespace CandellaServer.Dto
{
    public class ClientDto : MainDto
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
