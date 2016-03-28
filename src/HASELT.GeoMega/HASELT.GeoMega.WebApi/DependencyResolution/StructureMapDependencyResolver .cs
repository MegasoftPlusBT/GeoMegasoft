using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Dependencies;

namespace HASELT.GeoMega.WebApi.DependencyResolution
{
    public class StructureMapDependencyResolver : StructureMapScope, IDependencyResolver
    {
        private readonly IContainer container;

        public StructureMapDependencyResolver(IContainer container)
            : base(container)
        {
            this.container = container;
        }

        public IDependencyScope BeginScope()
        {
            var nestedContainer = this.container.GetNestedContainer();
            return new StructureMapScope(nestedContainer);
        }
    }
}