using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.Customers
{
    public class GetCustomerInfoByWatterCounterId
    {
        public class Request : BaseRequest<Response>
        {
            public int KorisnikID { get; set; }
        }

        public class Response : BaseResponse
        {
            public Response()
            {
                WaterCounters = new List<WaterCounterItem>();
            }

            public string TipNaKorisnik { get; set; }

            public string ShifraNaKorisnik { get; set; }

            public string ImeNaziv { get; set; }

            public string ShifraNaUlica { get; set; }

            public string Adresa { get; set; }

            public string KukenBroj { get; set; }

            public string Vlez { get; set; }

            public string Stan { get; set; }

            public string Grad { get; set; }
            public List<WaterCounterItem> WaterCounters { get; set; }

            public class Item
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
            public class WaterCounterItem
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
            public Validator()
            {
            }
        }

        public class Handler : BaseHandler<Request, Response>
        {
            public override async Task<Response> Handle(Request request)
            {
                var item = Connection.Query<Response.Item>(@"SELECT SifTipID, 
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
                var response = new Response();

                if (item != null)
                {
                    if (item.SifTipID == 5)
                        response.TipNaKorisnik = "Физичко лице";
                    else
                        response.TipNaKorisnik = "Правно лице";
                    response.ShifraNaKorisnik = item.ID.ToString();
                    response.ImeNaziv = item.Naziv;
                    response.ShifraNaUlica = item.UlicaID.ToString();
                    response.KukenBroj = item.Broj.ToString();
                    response.Vlez = item.Vlez;
                    response.Stan = item.Stan;
                    response.Grad = item.Mesto;
                    response.Adresa = item.Adresa;
                    
                    var sbSqlFizicki = @"Select  
                                    bfl.VidKorID as VidKorID, 
                                    bfl.KorisnikID as KorisnikID, 
                                    bfl.LokacijaID as LokacijaID,
                                    bfl.UlicaID as UlicaID,
                                    bfl.ReonID as ReonID, 
                                    bfl.Broilo as Broilo,
                                    lfl.Aktiven as Aktive,
                                    k.Naziv as Naziv, 
                                    k.Ulica as Ulica, 
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
                                    inner join Korisnici k on bfl.KorisnikID=k.KorisnikID
                                    where lfl.Aktiven=1 AND bfl.Status=1 
                                    AND bfl.KorisnikID = @KorisnikId";

                    

                    var fizickiBroilaResult = Connection.Query<Response.WaterCounterItem>(sbSqlFizicki,
                        new
                        {
                            KorisnikId = request.KorisnikID
                        }
                        );

                    response.WaterCounters.AddRange(fizickiBroilaResult.ToList());

                }

                return response;
            }
        }
    }
}
