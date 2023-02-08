using CandellaServer.Data.Abstract;
using Microsoft.AspNetCore.Identity;

namespace CandellaServer.Data
{
    public class User : Entity
    {
        public IdentityUser IdentityUser { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }
}
