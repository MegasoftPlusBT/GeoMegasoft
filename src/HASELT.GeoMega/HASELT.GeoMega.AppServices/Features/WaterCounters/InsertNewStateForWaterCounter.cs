using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class InsertNewStateForWaterCounter
    {
        public class Request : BaseRequest<Response>
        {
            public string WaterCounter { get; set; }

            public long NewState { get; set; }

            public long OldState { get; set; }

            public string Image { get; set; }//TODO: change string to byte[] for image data
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
                // var entity = await Session.LoadAsync<Entity>(request.Id);
                // Session.Store(entity);
                return new Response();
            }
        }
    }
}
