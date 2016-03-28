using HASELT.GeoMega.WebApi.DependencyResolution;
using Newtonsoft.Json.Serialization;
using System.Web.Http;

namespace HASELT.GeoMega.WebApi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            HttpConfiguration config = GlobalConfiguration.Configuration;
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.JsonFormatter.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
        }

        protected void Application_End()
        {
        }
    }
}
