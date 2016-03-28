using System.Threading.Tasks;
using System.Web.Http;
using HASELT.GeoMega.AppServices.Features.Users;

namespace HASELT.GeoMega.WebApi.Controllers
{
    [RoutePrefix("api/v1/users")]
    public class UsersController : BaseApiController
    {
        [HttpGet]
        [Route("{email?}")]
        public Task<GetUserByEmail.Response> Get(string email = "")
            => Handle(new GetUserByEmail.Request { Email = email });

        [HttpPost]
        [Route("edit")]
        public Task<EditUser.Response> Edit(EditUser.Request request)
            => Handle(request ?? new EditUser.Request());
    }
}
