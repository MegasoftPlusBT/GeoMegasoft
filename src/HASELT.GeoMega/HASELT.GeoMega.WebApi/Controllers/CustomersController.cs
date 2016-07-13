using System.Threading.Tasks;
using System.Web.Http;
using HASELT.GeoMega.AppServices.Features.Customers;

namespace HASELT.GeoMega.WebApi.Controllers
{
    //[Authorize]
    [RoutePrefix("api/v1/customers")]
    public class CustomersController : BaseApiController
    {
        [HttpGet]
        [Route("customerinfo")]
        public Task<GetCustomerInfoByWatterCounterId.Response> CustomerInfoByWaterCounter(int korisnikID)
         => Handle(new GetCustomerInfoByWatterCounterId.Request { KorisnikID = korisnikID });
    }
}
