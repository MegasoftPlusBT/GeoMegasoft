using System.Threading.Tasks;
using System.Web.Http;
using HASELT.Arc.Messaging;
using StructureMap.Attributes;
using HASELT.GeoMega.AppServices.Features;

namespace HASELT.GeoMega.WebApi
{
    [ExceptionFilterWrapper]
    public abstract class BaseApiController : ApiController
    {
        [SetterProperty]
        public IRequestDispatcher Dispatcher { get; set; }

        /// <summary>
        /// Handles the request by dispatching it and handling the success or errors response on the HTTP part.
        /// </summary>
        /// <typeparam name="TResponse"></typeparam>
        /// <param name="request"></param>
        /// <returns></returns>
        protected async Task<TResponse> Handle<TResponse>(BaseRequest<TResponse> request)
            where TResponse : BaseResponse
        {
            var result = await Dispatcher.DispatchAsync(request);
            if (result.HasErrors)
                throw new HASELT.Arc.Web.AspNetWebApi.ResultHttpException<TResponse>(result);

            return result.Response;
        }
    }
}
