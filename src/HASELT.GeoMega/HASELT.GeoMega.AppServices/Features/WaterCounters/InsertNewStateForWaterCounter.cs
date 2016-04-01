using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class InsertNewStateForWaterCounter
    {
        public class Request : BaseRequest<Response>
        {
            public int Vidkorid { get; set; }

            public int LokacijaID { get; set; }

            public int KorisnikID { get; set; }

            public int ReonID { get; set; }

            public string Broilo { get; set; }

            public string SostojbaStara { get; set; }

            public string SostojbaNova { get; set; }
        }

        public class Response : BaseResponse
        {
            public bool IsSucces { get; set; }
        }

        public class KorisnikInfo
        {
            public int SifTipID { get; set; }

            public int ID { get; set; }

            public string Naziv { get; set; }

            public int UlicaID { get; set; }

            public string Adresa { get; set; }

            public int Broj { get; set; }

            public string Mesto { get; set; }

            public string Drzava { get; set; }

            public string Vlez { get; set; }

            public string Stan { get; set; }

            public string Naziv1 { get; set; }
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
                int year = DateTime.UtcNow.Year;
                int month = DateTime.UtcNow.Month;
                var composeMesec = year.ToString() + "/" + (month < 10 ? "0" + month.ToString() : month.ToString());
                var razlika = Convert.ToInt64(request.SostojbaNova) - Convert.ToInt64(request.SostojbaStara);

                var brojClenovi = Connection.Query<int?>(@"Select BrojClenovi 
                                                           From LokacijaFizickiLica 
                                                           where Vidkorid=@Vidkorid and LokacijaID=@LokacijaID and KorisnikID=@KorisnikID and ReonID=@ReonID",
                                                           new { Vidkorid = request.Vidkorid, LokacijaID = request.LokacijaID, KorisnikID = request.KorisnikID, ReonID = request.ReonID }).FirstOrDefault();

                //TODO: Query from shifrarnik for all data.
                var korisnikInfo = Connection.Query<KorisnikInfo>(@"SELECT SifTipID, 
                                                                   ID,
                                                                   Naziv,
                                                                   UlicaID,
                                                                   Adresa, 
                                                                   Broj, 
                                                                   Mesto,
                                                                   Drzava,
                                                                   Vlez,
                                                                   Stan,
                                                                   Naziv1
                                                            FROM FinknJpk.dbo.Sifrarnik
                                                            WHERE ID=@KorisnikId", new { KorisnikId = request.KorisnikID }).FirstOrDefault();

                var result = Connection.Execute(@"INSERT INTO [dbo].[SostojbaFizicki]
                                                                       ([Vidkorid]
                                                                       ,[KorisnikID]
                                                                       ,[LokacijaID]
                                                                       ,[Broilo]
                                                                       ,[Mesec]
                                                                       ,[SostojbaStara]
                                                                       ,[SostojbaNova]
                                                                       ,[Razlika]
                                                                       ,[ReonID]
                                                                       ,[UlicaID]
                                                                       ,[Broj]
                                                                       ,[Vlez]
                                                                       ,[stan]
                                                                       ,[BrClenovi]
                                                                       ,[Datum])
                                                                 VALUES(@Vidkorid
                                                                       ,@KorisnikID
                                                                       ,@LokacijaID
                                                                       ,@Broilo
                                                                       ,@Mesec
                                                                       ,@SostojbaStara
                                                                       ,@SostojbaNova
                                                                       ,@Razlika
                                                                       ,@ReonID
                                                                       ,@UlicaID
                                                                       ,@Broj
                                                                       ,@Vlez
                                                                       ,@stan
                                                                       ,@BrClenovi
                                                                       ,@Datum)"
                                                                       , new
                                                                       {
                                                                           Vidkorid = request.Vidkorid,
                                                                           KorisnikID = request.KorisnikID,
                                                                           LokacijaID = request.LokacijaID,
                                                                           Broilo = request.Broilo,
                                                                           Mesec = composeMesec,
                                                                           SostojbaStara = request.SostojbaStara,
                                                                           SostojbaNova = request.SostojbaNova,
                                                                           Razlika = razlika.ToString(),
                                                                           ReonID = request.ReonID,
                                                                           UlicaID = korisnikInfo != null ? korisnikInfo.UlicaID : 1,
                                                                           Broj = korisnikInfo != null ? korisnikInfo.Broj.ToString() : "0",
                                                                           Vlez = korisnikInfo != null ? korisnikInfo.Vlez : "0",
                                                                           stan = korisnikInfo != null ? korisnikInfo.Broj.ToString() : "0",
                                                                           BrClenovi = brojClenovi != null ? brojClenovi : 0,
                                                                           Datum = DateTime.UtcNow
                                                                       });
                var response = new Response();
                response.IsSucces = result == 1;
                return response;
            }
        }
    }
}
