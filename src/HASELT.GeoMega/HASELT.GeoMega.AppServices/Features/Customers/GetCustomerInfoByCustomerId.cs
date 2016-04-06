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
            public string TipNaKorisnik { get; set; }

            public string ShifraNaKorisnik { get; set; }

            public string ImeNaziv { get; set; }

            public string ShifraNaUlica { get; set; }

            public string Adresa { get; set; }

            public string KukenBroj { get; set; }

            public string Vlez { get; set; }

            public string Stan { get; set; }

            public string Grad { get; set; }

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
                                                            WHERE ID=@KorisnikId",new { KorisnikId =request.KorisnikID} ).FirstOrDefault();
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
                }
                return response;
            }
        }
    }
}
