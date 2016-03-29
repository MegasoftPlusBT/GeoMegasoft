using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;


namespace HASELT.GeoMega.AppServices.Features.Users
{
    public class GetUserByUserName
    {
        public class Request : BaseRequest<Response>
        {
            public string UserName { get; set; }
        }

        public class Response : BaseResponse
        {
            public int ID { get; set; }

            public string Lozinka { get; set; }

            public string user { get; set; }

            public DateTime VaziOD { get; set; }

            public DateTime VaziDo { get; set; }

            public bool Blokiran { get; set; }

            public int Nivo { get; set; }

            public string Korisnik { get; set; }
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
                var response = Connection.Query<Response>(@"SELECT * FROM [geomegaDb].[dbo].[Users] WHERE [user] = @user", new { user = request.UserName }).FirstOrDefault();
                return response;
            }
        }
    }
}
