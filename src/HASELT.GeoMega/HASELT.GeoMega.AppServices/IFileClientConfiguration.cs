using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices
{
    public interface IFileClientConfiguration
    {
        string Storage_RootPath { get; }
        string Storage_BaseUrl { get; }
    }
}
