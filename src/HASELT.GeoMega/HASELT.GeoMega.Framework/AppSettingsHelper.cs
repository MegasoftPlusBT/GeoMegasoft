using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.Framework
{
    public static class AppSettingsHelper
    {
        public static TEnum GetConfigValueAsEnum<TEnum>(string configurationKey)
        {
            string str = GetConfigValueAsString(configurationKey);

            object obj = Enum.Parse(typeof(TEnum), str);
            if ((obj is TEnum) == false)
                throw new ArgumentException(configurationKey + " has invalid value.");

            return (TEnum)obj;
        }

        public static string GetConfigValueAsString(string configurationKey)
        {
            string str = ConfigurationManager.AppSettings[configurationKey];
            if (string.IsNullOrEmpty(str))
                throw new ArgumentException(configurationKey + " is not set.");

            return str;
        }

        public static bool GetConfigValueAsBool(string configurationKey)
        {
            string str = ConfigurationManager.AppSettings[configurationKey];
            if (string.IsNullOrEmpty(str))
                throw new ArgumentException(configurationKey + " is not set.");

            bool result;
            if (!bool.TryParse(str, out result))
                throw new ArgumentException(configurationKey + " has invalid value.");

            return result;
        }

        public static int GetConfigValueAsInt(string configurationKey)
        {
            string str = ConfigurationManager.AppSettings[configurationKey];
            if (string.IsNullOrEmpty(str))
                throw new ArgumentException(configurationKey + " is not set.");

            int result;
            if (!int.TryParse(str, out result))
                throw new ArgumentException(configurationKey + " has invalid value.");

            return result;
        }
    }
}
