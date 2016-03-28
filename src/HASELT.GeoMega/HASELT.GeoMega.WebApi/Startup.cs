using System;
using System.Linq;
using System.Web.Http;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Practices.ServiceLocation;
using Owin;
using HASELT.GeoMega.WebApi.Security;
using HASELT.GeoMega.Framework;
using HASELT.GeoMega.WebApi.DependencyResolution;

namespace HASELT.GeoMega.WebApi
{
    public class Startup
    {
        public static BootstrapperSettings _settings = new BootstrapperSettings();
        private static Bootstrapper _bootstrapper = new Bootstrapper();

        public void Configuration(IAppBuilder app)
        {
            var httpConfig = GlobalConfiguration.Configuration;

            // Web API configuration and services
            httpConfig.Filters.Add(new ExceptionFilterWrapperAttribute());

            // Web API routes
            httpConfig.MapHttpAttributeRoutes();
            httpConfig.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/v1/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            _bootstrapper.Start(_settings);

            httpConfig.DependencyResolver = new StructureMapDependencyResolver(_bootstrapper.Container);

            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(httpConfig);
        }
    }
}