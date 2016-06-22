using HASELT.Arc.Messaging;
using StructureMap.Attributes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features
{
    /// <summary>
    /// Abstract handler responsible to provide support for inherited handlers. Resolves very common dependencies and provides data for user claims.
    /// ATTENTION: Some properties have injected values using Structuremap's setter injection. THIS IS ONLY CLASS WITH SUCH NEED. DO NOT USE SETTER INJECTION.
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    public abstract class BaseHandler<TRequest, TResponse> : IRequestHandler<TRequest, TResponse>
             where TRequest : IRequest<TResponse>
             where TResponse : IResponse
    {
        [SetterProperty]
        public IDbConnection Connection { get; set; }

        //[SetterProperty]
        //public ILogger Logger { get; set; }
        // TODO: Add logger

        [SetterProperty]
        public IBootstrapperConfiguration Configuration { get; set; }

        /// <summary>
        /// ATTENTION: Some properties have injected values using Structuremap's setter injection. THIS IS ONLY CLASS WITH SUCH NEED. DO NOT USE SETTER INJECTION.
        /// </summary>
        protected BaseHandler()
        {
        }

        public abstract Task<TResponse> Handle(TRequest request);

        protected ClaimsIdentity UserIdentity => Thread.CurrentPrincipal.Identity as ClaimsIdentity;
    }
}
