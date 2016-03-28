using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features.Reons
{
    public class GetReons
    {
        public class Request : BaseRequest<Response>
        {
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
                //FROM Reons
                //").AsList();

                //Connection.Execute("INSERT INTO Reons VALUES(...)"
                //throw new NotImplementedException();
                return new Response();
            }
        }
    }
}
