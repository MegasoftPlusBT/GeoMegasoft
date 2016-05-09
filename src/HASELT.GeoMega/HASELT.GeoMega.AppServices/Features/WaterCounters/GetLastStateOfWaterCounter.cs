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

            public string SlikaSostojba { get; set; }

            public string Broilo { get; set; }

            public string ImeNaziv { get; set; }
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
                                                    SELECT sf.SostojbaStara,
                                                           sf.SostojbaNova, 
                                                           sf.Mesec,
                                                           sf.SlikaSostojba,
                                                           sf.Broilo,
														   k.Naziv as ImeNaziv
                                                            
                                                          FROM SostojbaFizicki as sf
														  inner join Korisnici k on sf.KorisnikID=k.KorisnikID

                                                          WHERE sf.Vidkorid=@Vidkorid and sf.LokacijaID=@LokacijaID and sf.KorisnikID=@KorisnikID and sf.ReonID=@ReonID and sf.Broilo=@Broilo
                                                          ORDER BY sf.Broilo, sf.Mesec, sf.Datum",
                                                          new { Vidkorid = request.Vidkorid, LokacijaID = request.LokacijaID, KorisnikID = request.KorisnikID, ReonID = request.ReonID, Broilo = request.Broilo }).LastOrDefault();
                if (response == null)
                    response = new Response();

                return response;
            }
        }
    }
}
