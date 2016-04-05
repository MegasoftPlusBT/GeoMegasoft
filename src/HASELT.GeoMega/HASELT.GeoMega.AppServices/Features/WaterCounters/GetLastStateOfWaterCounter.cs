using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class GetLastStateOfWaterCounter
    {
        public class Request : BaseRequest<Response>
        {
            public int Vidkorid { get; set; }

            public int LokacijaID { get; set; }

            public int KorisnikID { get; set; }

            public int ReonID { get; set; }

            public string Broilo { get; set; }
        }

        public class Response : BaseResponse
        {
            public Response()
            {
                SostojbaNova = "0";
                SostojbaNova = "0";
            }
            public string SostojbaStara { get; set; }

            public string SostojbaNova { get; set; }

            public string Mesec { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
            }
        }

        public class Handler : BaseHandler<Request, Response>
        {
            public override async Task<Response> Handle(Request request)
            {
                var response = Connection.Query<Response>(@"
                                                    SELECT SostojbaStara,
                                                           SostojbaNova, 
                                                           Mesec
                                                          FROM SostojbaFizicki
                                                          WHERE Vidkorid=@Vidkorid and LokacijaID=@LokacijaID and KorisnikID=@KorisnikID and ReonID=@ReonID and Broilo=@Broilo
                                                          ORDER BY Broilo, Mesec, Datum",
                                                          new { Vidkorid = request.Vidkorid, LokacijaID = request.LokacijaID, KorisnikID = request.KorisnikID, ReonID = request.ReonID, Broilo = request.Broilo }).LastOrDefault();
                if (response == null)
                    response = new Response();

                return response;
            }
        }
    }
}
