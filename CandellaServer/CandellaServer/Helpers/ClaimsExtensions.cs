using CandellaServer.Data;
using System.Security.Claims;

namespace CandellaServer.Helpers
{
    public static class ClaimsExtensions
    {
        public static UserInfo ToUserInfo(this ClaimsPrincipal claimsPrincipal)
        {
            return new UserInfo
            {
                Username = claimsPrincipal.Identity.Name
            };
        }
    }

}