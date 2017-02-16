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

                public int? UlicaID { get; set; }

                public int ReonID { get; set; }

                public string Broilo { get; set; }

                public bool Aktive { get; set; }

                public string Naziv { get; set; }

                public string Ulica { get; set; }

                public string Broj { get; set; }

                public string NovaSostojba { get; set; }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
        }

        public class Handler : BaseHandler<Request, Response>
        {
            public override async Task<Response> Handle(Request request)
            {
                var sbSqlFizicki = new StringBuilder(@"Select  
                                    bfl.VidKorID as VidKorID, 
                                    bfl.KorisnikID as KorisnikID, 
                                    bfl.LokacijaID as LokacijaID,
                                    bfl.UlicaID as UlicaID,
                                    bfl.ReonID as ReonID, 
                                    bfl.Broilo as Broilo,
                                    lfl.Aktiven as Aktive,
                                    k.Naziv as Naziv, 
                                    k.Adresa as Ulica, 
                                    k.Broj as Broj,
									(
									SELECT TOP 1 sf.SostojbaNova from SostojbaFizicki sf
									Where sf.Vidkorid=bfl.VidKorID and sf.KorisnikID=bfl.KorisnikID and sf.LokacijaID=bfl.LokacijaID and sf.Broilo=bfl.Broilo
									Order by sf.Mesec desc
									) as NovaSostojba
                                    From BroilaFizickiLica bfl
                                    left join LokacijaFizickiLica lfl on 
                                    lfl.VidKorID=bfl.VidKorID AND 
                                    lfl.LokacijaID=bfl.LokacijaID AND 
                                    lfl.KorisnikID=bfl.KorisnikID AND
                                    lfl.ReonID=bfl.ReonID
                                    inner join Sifrarnik k on bfl.KorisnikID=k.ID and bfl.vidkorid = k.siftipid
                                    where lfl.Aktiven=1 AND bfl.Status=1");
                var sbSqlPravni = new StringBuilder(@"Select 
                                    lpl.VidKorID as VidKorID, 
                                    bpl.KorisnikID as KorisnikID,
                                    bpl.LokacijaID as LokacijaID, 
                                    bpl.ReonID as ReonID, 
                                    bpl.Broilo as Broilo, 
                                    lpl.Aktiven as Aktiven, 
                                    k.Naziv as Naziv, 
                                    k.Adresa as Ulica, 
                                    k.Broj as Broj,
									(
									SELECT TOP 1 sp.SostojbaNova from SostojbaPravni sp
									Where  sp.Vidkorid=bpl.VidKorID and sp.KorisnikID=bpl.KorisnikID and sp.LokacijaID=bpl.LokacijaID and sp.Broilo=bpl.Broilo
									Order by sp.Mesec desc
									) as NovaSostojba
                                    From BroilaFizickiLica bpl
                                    left join LokacijaPravniLica lpl on 
									lpl.vidkorid=bpl.vidkorid and
									lpl.LokacijaID=bpl.LokacijaID AND 
                                    lpl.KorisnikID=bpl.KorisnikID AND
                                    lpl.ReonID=bpl.ReonID
                                    inner join Sifrarnik k on bpl.KorisnikID=k.ID 
                                    where lpl.Aktiven=1");

                sbSqlFizicki.Append(@" AND bfl.ReonID = @ReonId");
                sbSqlPravni.Append(@" AND bpl.ReonID = @ReonId");

                if (!string.IsNullOrEmpty(request.Location))
                {
                    sbSqlFizicki.Append(@" AND (k.Adresa like @Location or k.Broj like @Location or (k.Adresa+' '+k.Broj) like @Location)");
                    sbSqlPravni.Append(@" AND (k.Adresa like @Location or k.Broj like @Location or (k.Adresa+' '+k.Broj) like @Location)");
                }

                if (!string.IsNullOrEmpty(request.FirstLastName))
                {
                    sbSqlFizicki.Append(@" AND (k.Naziv like @Naziv)");
                    sbSqlPravni.Append(@" AND (k.Naziv like @Naziv)");
                }

                sbSqlFizicki.Append(" ORDER BY k.Naziv ");
                sbSqlPravni.Append(" ORDER BY k.Naziv ");

                var query = new StringBuilder();
                query.AppendLine(sbSqlFizicki.ToString());
                query.AppendLine(sbSqlPravni.ToString());
                var multi = Connection.QueryMultiple(query.ToString(), new { ReonId = request.ReionId, Location = $"%{request.Location}%", Naziv = $"%{request.FirstLastName}%" });
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
