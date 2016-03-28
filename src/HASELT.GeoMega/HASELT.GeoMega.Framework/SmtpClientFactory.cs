using HASELT.GeoMega.AppServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.Framework
{
    public static class SmtpClientFactory
    {
        public static SmtpClient CreateSmtpClient(ISmtpClientConfiguration settings)
        {
            var client = new SmtpClient();

            switch (settings.Smtp_DeliveryMethod)
            {
                case SmtpDeliveryMethodEnum.Network:
                    client.Credentials = new NetworkCredential(settings.Smtp_From, settings.Smtp_Password);
                    client.Port = settings.Smtp_Port;
                    client.Host = settings.Smtp_Host;
                    client.EnableSsl = settings.Smtp_EnableSsl;
                    break;
                case SmtpDeliveryMethodEnum.SpecifiedPickupDirectory:
                    client.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
                    client.PickupDirectoryLocation = settings.Smtp_PickupDirectoryLocation;
                    break;
                default:
                    throw new ArgumentException("Smtp delivery method not implemented.");
            }

            return client;
        }
    }
}
