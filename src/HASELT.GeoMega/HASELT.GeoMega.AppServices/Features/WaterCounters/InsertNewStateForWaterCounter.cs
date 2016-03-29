using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class InsertNewStateForWaterCounter
    {
        public class Request : BaseRequest<Response>
        {
            public int WaterCounterId { get; set; }

            public int NewState { get; set; }

            public string Image { get; set; }//TODO: change string to byte[] for image data
        }

        public class Response : BaseResponse
        {
            public bool IsSucces { get; set; }
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
                var result = Connection.Execute("INSERT INTO [dbo].[Sostojba](BroiloId, Vrednost, Kreirano) VALUES(@BroiloId,@Vrednost,@Kreirano)", new { BroiloId = request.WaterCounterId, Vrednost = request.NewState, Kreirano = DateTime.UtcNow });
                var response = new Response();
                response.IsSucces = result == 1;
                return response;
            }
        }
    }
}
