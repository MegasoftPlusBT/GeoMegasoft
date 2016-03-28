using Dapper;
using FluentValidation;
using System;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features.Users
{
    public class GetUserByEmail
    {
        public class Request : BaseRequest<Response>
        {
            public string Email { get; set; }
        }

        public class Response : BaseResponse
        {
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
//FROM Users
//").AsList();

                //Connection.Execute("INSERT INTO Users VALUES(...)"
                throw new NotImplementedException();
            }
        }
    }
}
