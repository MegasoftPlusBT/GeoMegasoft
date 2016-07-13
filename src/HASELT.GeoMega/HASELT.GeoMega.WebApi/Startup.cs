using System;
using System.Web.Http;
using HASELT.Arc.Messaging;
using HASELT.GeoMega.Framework;
using HASELT.GeoMega.WebApi.DependencyResolution;
using HASELT.GeoMega.WebApi.Security;
using Microsoft.Owin;
using Microsoft.Owin.Security.OAuth;
using Owin;

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
            var OAuthServerOptions = new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new UserAuthorizationServerProvider(_bootstrapper.Container.GetInstance<IRequestDispatcher>()),
               
            };
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(new OAuthBearerAuthenticationOptions());
            app.UseWebApi(httpConfig);
        }
    }
}