using System;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using FluentValidation;

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

            public string SlikaSostojba { get; set; }

            public string Lat { get; set; }

            public string Long { get; set; }
            public string Mesec { get; set; }
        }

        public class Response : BaseResponse
        {
            public bool IsSucces { get; set; } = false;

            public string Message { get; set; }
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
                var message = "Невалидни податоци";
                RuleFor(x => x.Mesec).NotEmpty().WithMessage(message);
            }
        }

        public class Handler : BaseHandler<Request, Response>
        {
            private readonly string oldInsertQuery = @"INSERT INTO [Komunalecjpk].[dbo].[SostojbaFizicki]
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
                                                                       ,@Long)";
            private readonly string waterCounterListItemQuery = @"
                Select  
                          bfl.VidKorID as VidKorID, 
                          bfl.KorisnikID as KorisnikId, 
                          bfl.LokacijaID as LokacijaId,
                          bfl.UlicaID as UlicaId,
                          bfl.ReonID as ReonId, 
                          bfl.Broilo as Broilo,
                          lfl.Aktiven as Aktive,
                          k.Naziv as Naziv, 
                          k.Ulica as Ulica, 
                          k.Broj as Broj,
	                    (
	                    SELECT TOP 1 sf.SostojbaNova from Komunalecjpk.dbo.SostojbaFizicki sf
		                    Where sf.Vidkorid=bfl.VidKorID 
		                    and sf.KorisnikID=bfl.KorisnikID
		                    and sf.LokacijaID=bfl.LokacijaID 
		                    and sf.Broilo=bfl.Broilo 
							 AND sf.Mesec = @YearMonth
	                    ) as SostojbaNova,
                        (
	                    SELECT TOP 1 sf.Mesec from Komunalecjpk.dbo.SostojbaFizicki sf
		                    Where sf.Vidkorid=bfl.VidKorID 
		                    and sf.KorisnikID=bfl.KorisnikID
		                    and sf.LokacijaID=bfl.LokacijaID 
		                    and sf.Broilo=bfl.Broilo 
							 AND sf.Mesec = @YearMonth
	                    ) as Mesec

                          From Komunalecjpk.dbo.BroilaFizickiLica bfl
                          left JOIN Komunalecjpk.dbo.LokacijaFizickiLica lfl on 
                          lfl.VidKorID=bfl.VidKorID AND 
                          lfl.LokacijaID=bfl.LokacijaID AND 
                          lfl.KorisnikID=bfl.KorisnikID AND
                          lfl.ReonID=bfl.ReonID
                          inner join Komunalecjpk.dbo.Korisnici k on bfl.KorisnikID=k.KorisnikID
                          where lfl.Aktiven=1 
	                      AND 
                          bfl.Status=1
	                      AND bfl.ReonID = @ReonId
						  AND bfl.Broilo IN (
						  
						  SELECT sf.Broilo from Komunalecjpk.dbo.SostojbaFizicki sf
		                    Where sf.Mesec = @YearMonth
							AND
							sf.Vidkorid=@VidKorID 
		                    and sf.KorisnikID=@KorisnikID
		                    and sf.LokacijaID=@LokacijaID 
		                    and sf.Broilo=@Broilo 
	                    )                  
            ";
            private readonly string waterCounterUpdateQuery = @"
                UPDATE  [Komunalecjpk].[dbo].[SostojbaFizicki]
                   SET 
	                   [SostojbaStara] =		@SostojbaStara
                      ,[SostojbaNova] =			@SostojbaNova
                      ,[Razlika] =				@Razlika
                      ,[UlicaID] =				@UlicaID
                      ,[Broj] =					@Broj
                      ,[Vlez] =					@Vlez
                      ,[stan] =					@stan
                      ,[BrClenovi] =			@BrClenovi
                      ,[Datum] =				@Datum
                      ,[SlikaSostojba] =		@SlikaSostojba
                      ,[Lat] =					@Lat
                      ,[Long] =					@Long

                 WHERE 
		                Vidkorid        =		   @Vidkorid
		                and KorisnikID  =          @KorisnikID
		                and LokacijaID  =          @LokacijaID
		                and Broilo      =		   @Broilo 
		                AND Mesec       =		   @Mesec";

            private readonly string korisnikInfoQuery = @"SELECT SifTipID, 
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
                                                            FROM FinknJpk_old.dbo.Sifrarnik
                                                            WHERE ID=@KorisnikId";

            public override async Task<Response> Handle(Request request)
            {
                var response = new Response();
                var composeMesec = request.Mesec;


                var razlika = Convert.ToInt64(request.SostojbaNova) - Convert.ToInt64(request.SostojbaStara);

                var brojClenovi = Connection.Query<int?>(@"Select BrojClenovi 
                    From Komunalecjpk.dbo.LokacijaFizickiLica 
                    where Vidkorid=@Vidkorid and LokacijaID=@LokacijaID and KorisnikID=@KorisnikID and ReonID=@ReonID",
                                                           new { Vidkorid = request.Vidkorid, LokacijaID = request.LokacijaID, KorisnikID = request.KorisnikID, ReonID = request.ReonID }).FirstOrDefault();


                var waterCounterItem = Connection.Query<Reons.GetAllDataFromReon.Response.WaterCounterListItem>(waterCounterListItemQuery, new
                {
                    YearMonth = request.Mesec,
                    ReonId = request.ReonID,
                    VidKorID = request.Vidkorid,
                    KorisnikID = request.KorisnikID,
                    LokacijaID = request.LokacijaID,
                    Broilo = request.Broilo
                }).FirstOrDefault();

                if(waterCounterItem != null && waterCounterItem.SostojbaNova != "0")
                {
                    response.Message = "Состојбата не е зачувана бидејќи веќе постои за овој месец";
                    return response;
                }

                if (string.IsNullOrEmpty(request.SostojbaNova))
                {
                    response.Message = "Полето нова состојба е задолжително";
                }
                else
                {
                    var korisnikInfo = Connection.Query<KorisnikInfo>(korisnikInfoQuery, new { KorisnikId = request.KorisnikID }).FirstOrDefault();

                    var result = Connection.Execute(waterCounterUpdateQuery
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
                                                                               Datum = DateTime.UtcNow,
                                                                               SlikaSostojba = request.SlikaSostojba,
                                                                               Lat = request.Lat,
                                                                               Long = request.Long
                                                                           });

                    response.IsSucces = result == 1;
                }

                return response;
            }
        }
    }
}
