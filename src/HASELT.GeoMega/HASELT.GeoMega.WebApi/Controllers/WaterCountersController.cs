using System;
using System.Threading.Tasks;
using System.Web.Http;
using HASELT.GeoMega.AppServices.Features.WaterCounters;

namespace HASELT.GeoMega.WebApi.Controllers
{
    [RoutePrefix("api/v1/watercounters")]
    public class WaterCountersController : BaseApiController
    {
        [HttpPost]
        [Route("search")]
        public Task<SearchWaterCounters.Response> Search(SearchWaterCounters.Request request)
          => Handle(request ?? new SearchWaterCounters.Request());

        [HttpPost]
        [Route("newCounter")]
        public Task<CreateNewWaterCounter.Response> CreateNewCounter(CreateNewWaterCounter.Request request)
        {
            return Handle(request);
        }

        [HttpPost]
        [Route("newstate")]
        public Task<InsertNewStateForWaterCounter.Response> InsertNewState(InsertNewStateForWaterCounter.Request request)
         => Handle(request ?? new InsertNewStateForWaterCounter.Request());

        [HttpGet]
        [Route("laststate")]
        public Task<GetLastStateOfWaterCounter.Response> GetLastState(int vidkorid, int lokacijaID, int korisnikID, int reonID, string broilo)
        => Handle(new GetLastStateOfWaterCounter.Request { Broilo = broilo, KorisnikID = korisnikID, LokacijaID = lokacijaID, ReonID = reonID, Vidkorid = vidkorid });

        [HttpPost]
        [Route("sync")]
        public Task<SynchronizeDataFromMobile.Response> Sync(SynchronizeDataFromMobile.Request request)
        {
            foreach (var item in request.ItemsToSave)
            {
                if (item.TypeOfAction == 0)
                {
                    try
                    {
                        Dispatcher.DispatchAsync(new InsertNewStateForWaterCounter.Request()
                        {
                            Broilo = item.Broilo,
                            KorisnikID = item.KorisnikID,
                            Lat = item.Lat,
                            LokacijaID = item.LokacijaID,
                            Long = item.Long,
                            ReonID = item.ReonID,
                            SlikaSostojba = item.SlikaSostojba,
                            SostojbaNova = item.SostojbaNova,
                            SostojbaStara = item.SostojbaStara,
                            Vidkorid = item.Vidkorid,
                            Mesec = request.Mesec

                        }).Wait();
                    }
                    catch(Exception ex)
                    {
                    }
                }
                else
                {
                    try
                    {
                        Dispatcher.DispatchAsync(new CreateNewWaterCounter.Request()
                        {
                            Broilo = item.Broilo,
                            KorisnikID = item.KorisnikID,
                            Lat = item.Lat,
                            LokacijaID = item.LokacijaID,
                            Long = item.Long,
                            ReonID = item.ReonID,
                            SlikaSostojba = item.SlikaSostojba,
                            Sostojba = item.SostojbaNova,
                            Vidkorid = item.Vidkorid,
                            Mesec = request.Mesec
                        }).Wait();
                    }
                    catch (Exception ex)
                    {
                    }
                }
            }
            return Handle(new SynchronizeDataFromMobile.Request()
            {
                 Mesec = request.Mesec
            });

        }
    }
}
