using Dapper;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class CreateNewWaterCounter
    {
        public class Request : BaseRequest<Response>
        {
            public int Vidkorid { get; set; }

            public int LokacijaID { get; set; }

            public int KorisnikID { get; set; }

            public int ReonID { get; set; }

            public string Broilo { get; set; }

            public string Sostojba { get; set; }

            public string SlikaSostojba { get; set; }

            public string Lat { get; set; }

            public string Long { get; set; }
        }

        public class Response : BaseResponse
        {
            public bool IsSucces { get; set; } = false;

            public string Message { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                var message = "Невалидни податоци";
                RuleFor(x => x.Broilo).NotEmpty().WithMessage(message);
                RuleFor(x => x.KorisnikID).NotEmpty().WithMessage(message);
                RuleFor(x => x.LokacijaID).NotEmpty().WithMessage(message);
                RuleFor(x => x.ReonID).NotEmpty().WithMessage(message);
                RuleFor(x => x.Vidkorid).NotEmpty().WithMessage(message);

                RuleFor(x => x.Sostojba).NotEmpty().WithMessage(message);
                RuleFor(x => x.Lat).NotEmpty().WithMessage(message);
                RuleFor(x => x.Long).NotEmpty().WithMessage(message);
            }
        }

        public class Handler : BaseHandler<Request, Response>
        {
            public override async Task<Response> Handle(Request request)
            {
                var response = new Response();
                var createQuery = @"
                    INSERT INTO [dbo].[BroilaFizickiLica]
                       ([VidKorID]
                       ,[KorisnikID]
                       ,[LokacijaID]
                       ,[ReonID]
                       ,[Broilo]
                       ,[Status]
                       ,[Dimenzii]
                       ,[vbro]
                       ,[UlicaID]
                       ,[MestoID]
                       ,[Broi]
                       ,[Tip]
                       ,[DatumIns]
                       ,[DatumBaz])
                 VALUES
                       (@VidKorId
                       ,@KorisnikId
                       ,@LokacijaId
                       ,@ReonId
                       ,@Broilo
                       ,1
                       ,null
                       ,1
                       ,null
                       ,1
                       ,1
                       ,1
                       ,null
                       ,null
		               )
                ";

                var createCounterResult = Connection.Execute(createQuery, new
                {
                    VidKorId = request.Vidkorid,
                    KorisnikId = request.KorisnikID,
                    LokacijaId = request.LokacijaID,
                    ReonId = request.ReonID,
                    Broilo = request.Broilo
                });



                int year = DateTime.UtcNow.Year;
                int month = DateTime.UtcNow.Month;
                var composeMesec = year.ToString() + "/" + (month < 10 ? "0" + month.ToString() : month.ToString());
                var razlika = request.Sostojba;

                var brojClenovi = Connection.Query<int?>(@"Select BrojClenovi 
                                                           From LokacijaFizickiLica 
                                                           where Vidkorid=@Vidkorid and LokacijaID=@LokacijaID and KorisnikID=@KorisnikID and ReonID=@ReonID",
                                                           new { Vidkorid = request.Vidkorid, LokacijaID = request.LokacijaID, KorisnikID = request.KorisnikID, ReonID = request.ReonID }).FirstOrDefault();

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
                                                                       ,[Datum]
                                                                       ,[SlikaSostojba]
                                                                       ,[Lat]
                                                                       ,[Long])
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
                                                                       ,@Datum
                                                                       ,@SlikaSostojba
                                                                       ,@Lat
                                                                       ,@Long)"
                                                                       , new
                                                                       {
                                                                           Vidkorid = request.Vidkorid,
                                                                           KorisnikID = request.KorisnikID,
                                                                           LokacijaID = request.LokacijaID,
                                                                           Broilo = request.Broilo,
                                                                           Mesec = composeMesec,
                                                                           SostojbaStara = 0,
                                                                           SostojbaNova = request.Sostojba,
                                                                           Razlika = razlika.ToString(),
                                                                           ReonID = request.ReonID,
                                                                           UlicaID = korisnikInfo != null ? korisnikInfo.UlicaID : 1,
                                                                           Broj = korisnikInfo != null ? korisnikInfo.Broj.ToString() : "0",
                                                                           Vlez = korisnikInfo != null ? korisnikInfo.Vlez : "0",
                                                                           stan = korisnikInfo != null ? korisnikInfo.Broj.ToString() : "0",
                                                                           BrClenovi = brojClenovi != null ? brojClenovi : 0,
                                                                           Datum = DateTime.UtcNow,
                                                                           SlikaSostojba = request.SlikaSostojba,
                                                                           Lat = request.Lat,
                                                                           Long = request.Long
                                                                       });

                response.IsSucces = result == 1;

                return response;
            }
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
    }
}
