using HASELT.GeoMega.AppServices;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HASELT.Arc.Messaging;
using HASELT.Arc.FileClients;
using HASELT.Arc.FileClients.FileSystem;
using HASELT.Arc.Logging;
using System.Net.Mail;
using System.Net;
using HASELT.GeoMega.AppServices.Features;

namespace HASELT.GeoMega.Framework.Registries
{
    public class FrameworkRegistry : Registry
    {
        public FrameworkRegistry(IBootstrapperConfiguration settings)
        {
            Scan(scanner =>
            {
                scanner.AssemblyContainingType(typeof(FluentValidation.AbstractValidator<>));
                scanner.AssemblyContainingType(typeof(BaseResponse));
                scanner.AssemblyContainingType(typeof(IRequestHandler<,>));

                scanner.AddAllTypesOf(typeof(FluentValidation.IValidator<>));
                scanner.AddAllTypesOf(typeof(IRequestHandler<,>));
                scanner.AddAllTypesOf(typeof(IRootRequestHandler<,>));
                scanner.AddAllTypesOf(typeof(IEventHandler<>));

                scanner.WithDefaultConventions();
            });

            For<IBootstrapperConfiguration>().Use(settings);

            // Messaging
            For<IRequestDispatcher>().Use(ctx => new RequestDispatcher(type => ctx.GetInstance(type)));
            For<IEventDispatcher>().Use(ctx => new EventDispatcher(type => ctx.GetAllInstances(type)));
            For(typeof(IRootRequestHandler<,>)).Use(typeof(RootRequestHandler<,>)); // Register default handler.
            // Decorate request handlers behaviour.
            var types = For(typeof(IRootRequestHandler<,>));
            types.DecorateAllWith(typeof(AppServices.Decorators.ValidatorHandler<,>));
            // End Messaging

            For<IFileClient>().Use(ctx => new LocalFileClient(settings.Storage_RootPath, settings.Storage_BaseUrl));
            For<ILogger>().Use(ctx => new ConsoleLogger()); 
            For<SmtpClient>().Use(() => SmtpClientFactory.CreateSmtpClient(settings));
        }
    }
}
