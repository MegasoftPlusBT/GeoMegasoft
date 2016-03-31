using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class GetCustomerInfoByWatterCounterId
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
            public int WaterCounterId { get; set; }

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
                // this is just an example
                //                var response = Connection.Query<Response>(@"
                //SELECT *
                //FROM Korisnici
                //WHERE KorisnikId=@KorisnikId
                //",request.CustomerId).AsList();
                //KorisnikId from KorisnikBroilo


                //TODO: Get info data for Korisnik
                /*
                1. Тип на Корисник
                2. Шифра на корисник
                3. Име / назив
                4. Шифра на улица
                5. Куќен број
                6. Влез
                7. Стан
                8. Град                
                */

                //Connection.Execute("INSERT INTO Users VALUES(...)"


                return new Response();
            }
        }
    }
}
