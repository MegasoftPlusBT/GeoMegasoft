using HASELT.Arc.Messaging;
using HASELT.GeoMega.AppServices.Features.Users;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Cors;

namespace HASELT.GeoMega.WebApi.Security
{

    public class UserAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        readonly IRequestDispatcher _requestDispatcher;

        public UserAuthorizationServerProvider(IRequestDispatcher requestDispatcher)
        {
            _requestDispatcher = requestDispatcher;
        }
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }
        
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            string errorMessage = "Погрешена лозинка или корисничко име";
            var user = await _requestDispatcher.DispatchAsync(new GetUserByUserName.Request
            {
                UserName = context.UserName,
                Password = context.Password
            });
            if (user.Response == null || user.HasErrors)
                context.SetError(errorMessage);
            else
            {
                if (user.Response.Lozinka == context.Password)
                {
                    var identity = new ClaimsIdentity(context.Options.AuthenticationType);
                    identity.AddClaim(new Claim(ClaimTypes.Name, user.Response.UserName));
                    identity.AddClaim(new Claim(ClaimTypes.Role, "admin"));
                    identity.AddClaim(new Claim("username", user.Response.UserName));
                    identity.AddClaim(new Claim("userId", user.Response.ID.ToString()));
                    var props = new AuthenticationProperties(new Dictionary<string, string>
                    {
                        {
                            "as:client_id", (context.ClientId == null) ? string.Empty : context.ClientId
                        },
                        {
                            "userName", context.UserName
                        },
                        {
                            "userId", user.Response.ID.ToString()
                        }
                    });
                    var ticket = new AuthenticationTicket(identity, props);
                    context.Validated(ticket);
                }
                else
                    context.SetError(errorMessage);
            }

        }
        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }
    }
}