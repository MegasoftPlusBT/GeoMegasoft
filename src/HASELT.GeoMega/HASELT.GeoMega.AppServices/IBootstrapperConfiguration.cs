using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices
{
    public interface IBootstrapperConfiguration : ISmtpClientConfiguration, IFileClientConfiguration
    {
        string Database_Main_ConnectionString { get; }
        ApplicationTypeEnum ApplicationType { get; }
    }

    public enum ApplicationTypeEnum
    {
        WebApplication = 1,
        ConsoleApplication = 2
    }
}
