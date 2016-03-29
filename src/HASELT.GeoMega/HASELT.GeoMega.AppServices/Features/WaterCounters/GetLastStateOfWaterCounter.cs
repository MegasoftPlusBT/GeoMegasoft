using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class GetLastStateOfWaterCounter
    {
        public class Request : BaseRequest<Response>
        {
            public int WaterCounterId { get; set; }
        }

        public class Response : BaseResponse
        {
            public int State { get; set; }
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
                int? state = Connection.Query<int>(@"SELECT Vrednost FROM Sostojba WHERE BroiloId = @BroiloId ORDER BY Kreirano DESC", new { BroiloId = request.WaterCounterId }).FirstOrDefault();

                return new Response
                {
                    State = state == null ? 0 : (int)state
                };
            }
        }
    }
}
