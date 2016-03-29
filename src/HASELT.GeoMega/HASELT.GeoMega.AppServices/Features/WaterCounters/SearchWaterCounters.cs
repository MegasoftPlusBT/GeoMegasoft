using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class SearchWaterCounters
    {
        public class Request : BaseRequest<Response>
        {
            public string FirstLastName { get; set; }

            public string Location { get; set; }

            public int? Radius { get; set; }
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
                public string FirstName { get; set; }

                public string LastName { get; set; }

                public string Address { get; set; }

                public int WaterCounterId { get; set; } //TOOD: Check WaterCounterId

                public int CustomerId { get; set; }

                public int LocationId { get; set; }

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
