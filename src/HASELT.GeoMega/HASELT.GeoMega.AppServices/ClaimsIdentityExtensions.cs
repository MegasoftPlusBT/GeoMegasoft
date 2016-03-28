using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace System.Security.Claims
{
    public static class ClaimsIdentityExtensions
    {
        public static Guid? FindFirstAsGuid(this ClaimsIdentity identity, string claimType)
        {
            if (identity == null)
                return null;

            var claim = identity.FindFirst(claimType);
            if (claim == null)
                return null;

            Guid result = Guid.Empty;
            if (Guid.TryParse(claim.Value, out result))
                return result;
            else
                return null;
        }
    }
}
