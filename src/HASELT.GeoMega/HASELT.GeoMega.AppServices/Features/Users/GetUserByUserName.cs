using System;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using FluentValidation;


namespace HASELT.GeoMega.AppServices.Features.Users
{
    public class GetUserByUserName
    {
        public class Request : BaseRequest<Response>
        {
            public string UserName { get; set; }
            public string Password { get; set; }
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

            public string UserName { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
        }

        public class Handler : BaseHandler<Request, Response>
        {
            public override async Task<Response> Handle(Request request)
            {
                var response = Connection.Query<Response>(@"SELECT * FROM [KomunalecJPK].[dbo].[ViewNajava] WHERE UserName = @user and Lozinka=@lozinka", new { user = request.UserName, lozinka=request.Password }).FirstOrDefault();
                return response;
            }
        }
    }
}
