using System.Threading.Tasks;
using System.Web.Http;
using HASELT.GeoMega.AppServices.Features.Reons;

namespace HASELT.GeoMega.WebApi.Controllers
{
    [RoutePrefix("api/v1/reons")]
    public class ReonsController : BaseApiController
    {
        [HttpGet]
        [Route("reonList")]
        public Task<GetReons.Response> ReonList(GetReons.Request request)
        {
            return Handle(request ?? new GetReons.Request());
        }

        [HttpGet]
        [Route("reonData")]
        public Task<GetAllDataFromReon.Response> ReonData([FromUri]GetAllDataFromReon.Query request)
        {
            return Handle(request);
        }
    }
}