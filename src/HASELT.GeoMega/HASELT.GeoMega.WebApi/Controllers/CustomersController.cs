using HASELT.GeoMega.AppServices.Features.Customers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

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
