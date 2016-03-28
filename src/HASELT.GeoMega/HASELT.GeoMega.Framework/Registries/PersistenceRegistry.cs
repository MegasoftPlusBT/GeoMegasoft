using HASELT.GeoMega.AppServices;
using StructureMap;
using System.Data;
using System.Data.SqlClient;

namespace HASELT.GeoMega.Framework.Registries
{
    public class PersistenceRegistry : Registry
    {
        readonly IBootstrapperConfiguration _settings;

        public PersistenceRegistry(IBootstrapperConfiguration settings)
        {
            _settings = settings;

            For<IDbConnection>().Use("", ctx =>
            {
                var conn = new SqlConnection(settings.Database_Main_ConnectionString);
                conn.Open();
                return conn;
            });
        }
    }
}
