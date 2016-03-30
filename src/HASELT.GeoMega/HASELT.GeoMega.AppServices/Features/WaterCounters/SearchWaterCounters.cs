using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class SearchWaterCounters
    {
        public class Request : BaseRequest<Response>
        {
            public string FirstLastName { get; set; }

            public string Location { get; set; }

            public int? Radius { get; set; }

            public int ReionId { get; set; }
        }

        public class Response : BaseResponse
        {
            public Response()
            {
                Items = new List<Item>();
            }

            public List<Item> Items { get; set; }

            public class Item
            {
                public int VidKorID { get; set; }

                public int KorisnikID { get; set; }

                public int LokacijaID { get; set; }

                public int ReonID { get; set; }

                public string Broilo { get; set; }

                public bool Aktive { get; set; }

                public string Naziv { get; set; }

                public string Broj { get; set; }
            }
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
                StringBuilder sbSqlFizicki = new StringBuilder(@"Select  
                                    bfl.VidKorID as VidKorID, 
                                    bfl.KorisnikID as KorisnikID, 
                                    bfl.LokacijaID as LokacijaID, 
                                    bfl.ReonID as ReonID, 
                                    bfl.Broilo as Broilo,
                                    lfl.Aktiven as Aktive,
                                    k.Naziv as Naziv, 
                                    k.Ulica as Ulica, 
                                    k.Broj as Broj
                                    From BroilaFizickiLica bfl
                                    left join LokacijaFizickiLica lfl on 
                                    lfl.VidKorID=bfl.VidKorID AND 
                                    lfl.LokacijaID=bfl.LokacijaID AND 
                                    lfl.KorisnikID=bfl.KorisnikID AND
                                    lfl.ReonID=bfl.ReonID
                                    inner join Korisnici k on bfl.KorisnikID=k.KorisnikID
                                    where lfl.Aktiven=1 ");
                StringBuilder sbSqlPravni = new StringBuilder(@"Select 
                                    lpl.VidKorID as VidKorID, 
                                    bpl.KorisnikID as KorisnikID,
                                    bpl.LokacijaID as LokacijaID, 
                                    bpl.ReonID as ReonID, 
                                    bpl.Broilo as Broilo, 
                                    lpl.Aktiven as Aktiven, 
                                    k.Naziv as Naziv, 
                                    k.Ulica as Ulica, 
                                    k.Broj as Broj
                                    From BroilaPravniLica bpl
                                    left join LokacijaPravniLica lpl on 
                                    bpl.LokacijaID=bpl.LokacijaID AND 
                                    bpl.KorisnikID=bpl.KorisnikID AND
                                    bpl.ReonID=bpl.ReonID
                                    inner join Korisnici k on bpl.KorisnikID=k.KorisnikID
                                    where lpl.Aktiven=1 ");

                sbSqlFizicki.Append(@" AND bfl.ReonID = @ReonId");
                sbSqlPravni.Append(@" AND bpl.ReonID = @ReonId");

                if (!string.IsNullOrEmpty(request.Location))
                {
                    sbSqlFizicki.Append(@" OR (k.Ulica like '%@Location%' or k.Broj like '%@Location%' or (k.Ulica+' '+k.Broj) like '%@Location%')");
                    sbSqlPravni.Append(@" OR (k.Ulica like '%@Location%' or k.Broj like '%@Location%' or (k.Ulica+' '+k.Broj) like '%@Location%')");
                }

                if (!string.IsNullOrEmpty(request.FirstLastName))
                {
                    sbSqlFizicki.Append(@" OR (k.Naziv like '%@Naziv%')");
                    sbSqlPravni.Append(@" OR (k.Naziv like '%@Naziv%')");
                }

                StringBuilder query = new StringBuilder();
                query.AppendLine(sbSqlFizicki.ToString());
                query.AppendLine(sbSqlPravni.ToString());
                var multi = Connection.QueryMultiple(query.ToString(), new { ReonId = request.ReionId, Location = request.Location, Naziv = request.FirstLastName });
                var fizickiLica = multi.Read<Response.Item>().ToList();
                var pravniLica = multi.Read<Response.Item>().ToList();
                var result = new List<Response.Item>();
                result.AddRange(fizickiLica);
                result.AddRange(pravniLica);
                return new Response
                {
                    Items = result
                };
            }
        }
    }
}
