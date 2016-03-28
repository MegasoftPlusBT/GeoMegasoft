using HASELT.Arc.Logging;
using HASELT.GeoMega.Framework;
using Microsoft.Practices.ServiceLocation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Filters;

namespace HASELT.GeoMega.WebApi
{
    public class ExceptionFilterWrapperAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            // Get the exception object.
            Exception exc = context.Exception;

            // Log the exception and notify system operators
            var logger = Bootstrapper.StaticContainer.GetInstance<ILogger>();
            logger.LogError(exc);
        }
    }
}