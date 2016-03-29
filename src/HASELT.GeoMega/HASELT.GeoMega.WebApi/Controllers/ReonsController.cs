using HASELT.GeoMega.AppServices.Features.Reons;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace HASELT.GeoMega.WebApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/v1/reons")]
    public class ReonsController : BaseApiController
    {
        [HttpGet]
        [Route("reons")]
        public Task<GetReons.Response> Get()
            => Handle(new GetReons.Request());
    }
}