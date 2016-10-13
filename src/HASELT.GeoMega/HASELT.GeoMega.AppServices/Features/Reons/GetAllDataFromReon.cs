using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using FluentValidation;

namespace HASELT.GeoMega.AppServices.Features.Reons
{
    public class GetAllDataFromReon
    {
        public class Query : BaseRequest<Response>
        {
            public int ReonId { get; set; }
            public string Month { get; set; }
            public string Year { get; set; }
        }

        public class Response : BaseResponse
        {
            public Response()
            {
                WaterCounters = new List<WaterCounterListItem>();
                Customers = new List<CustomerListItem>();
            }

            public List<WaterCounterListItem> WaterCounters { get; set; }

            public List<CustomerListItem> Customers { get; set; }

            public class CustomerListItem
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

            public class WaterCounterListItem
            {
                public int VidKorID { get; set; }

                public int KorisnikId { get; set; }

                public int LokacijaId { get; set; }

                public int? UlicaId { get; set; }

                public int ReonId { get; set; }

                public string Broilo { get; set; }

                public int Aktive { get; set; }

                public string Naziv { get; set; }

                public string Ulica { get; set; }

                public string Broj { get; set; }

                public string SostojbaNova { get; set; }

                public string Mesec { get; set; }
            }
        }

        public class Validator : AbstractValidator<Query>
        {
            public Validator()
            {
                RuleFor(x => x.ReonId).NotEmpty();
                RuleFor(x => x.Month).NotEmpty();
                RuleFor(x => x.Year).NotEmpty();
            }
        }

        public class Handler : BaseHandler<Query, Response>
        {
            public override async Task<Response> Handle(Query request)
            {
                var _queryCustomers = @"
                SELECT DISTINCT 
                SifTipID, 
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
                FROM FinknJpk_old.dbo.Sifrarnik AS sf
                INNER JOIN Komunalecjpk.dbo.LokacijaFizickiLica AS lf ON lf.ReonID = @ReonId AND sf.ID = lf.KorisnikID ";

                var customers = Connection.Query<Response.CustomerListItem>(_queryCustomers, new { ReonId = request.ReonId }).AsList();

                var _queryWaterCounters = @"
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
	                    SELECT TOP 1 sf.SostojbaStara from Komunalecjpk.dbo.SostojbaFizicki sf
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
                            And sf.SostojbaNova = '0'
	                    )                  

                        ";

                var waterCounters = Connection.Query<Response.WaterCounterListItem>(_queryWaterCounters, new { ReonId = request.ReonId, YearMonth = $"{request.Year}/{request.Month}" }).AsList();

                return new Response
                {
                    Customers = customers,
                    WaterCounters = waterCounters
                };
            }
        }
    }
}
