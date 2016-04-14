using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.Reons
{
    public class GetReons
    {
        public class Request : BaseRequest<Response>
        {
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
                public int ReonID { get; set; }

                public string Zabeleska { get; set; }
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
                var items = Connection.Query<Response.Item>(@"SELECT * FROM Reoni WHERE Zabeleska <> ' '").AsList();
                return new Response
                {
                    Items = items
                };
            }
        }
    }
}
