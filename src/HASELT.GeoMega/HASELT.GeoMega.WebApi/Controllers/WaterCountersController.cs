using HASELT.GeoMega.AppServices.Features.WaterCounters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace HASELT.GeoMega.WebApi.Controllers
{
    [RoutePrefix("api/v1/watercounters")]
    public class WaterCountersController : BaseApiController
    {
        [HttpPost]
        [Route("search")]
        public Task<SearchWaterCounters.Response> Search(SearchWaterCounters.Request request)
          => Handle(request ?? new SearchWaterCounters.Request());

        [HttpGet]
        [Route("customerinfo")]
        public Task<GetCustomerInfoByWatterCounter.Response> CustomerInfoByWaterCounter(string waterCounter = "")
          => Handle(new GetCustomerInfoByWatterCounter.Request { WaterCounter = waterCounter });

        [HttpPost]
        [Route("newstate")]
        public Task<InsertNewStateForWaterCounter.Response> InsertNewState(InsertNewStateForWaterCounter.Request request)
         => Handle(request ?? new InsertNewStateForWaterCounter.Request());
    }
}
