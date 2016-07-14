using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using HASELT.Arc.Core;

namespace HASELT.GeoMega.AppServices.Features.WaterCounters
{
    public class SynchronizeDataFromMobile
    {
        public class Response : BaseResponse
        {
            public bool IsSucces { get; set; } = false;

            public string Message { get; set; }
        }

        public class Request : BaseRequest<Response>
        {
            public Request()
            {

            }
            public IEnumerable<RequestItem> ItemsToSave { get; set; }
        }

        public class RequestItem 
        {
            public int Vidkorid { get; set; }

            public int LokacijaID { get; set; }

            public int KorisnikID { get; set; }

            public int ReonID { get; set; }

            public string Broilo { get; set; }

            public string SostojbaNova { get; set; }
            public string SostojbaStara { get; set; }

            public string SlikaSostojba { get; set; }

            public string Lat { get; set; }

            public string Long { get; set; }
            public int TypeOfAction { get; set; }
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
                return new Response() { IsSucces = true };
            }
        }

    }
}
