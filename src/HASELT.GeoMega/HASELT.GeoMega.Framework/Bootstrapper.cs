using HASELT.GeoMega.AppServices;
using HASELT.GeoMega.Framework.Registries;
using StructureMap;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.Framework
{
    public class Bootstrapper
    {
        private IBootstrapperConfiguration _settings;
        private IContainer _container;

        public bool IsBoostrapped { get; private set; }

        public IContainer Container { get { return _container; } }

        public static IContainer StaticContainer { get; private set; }

        public void Start(IBootstrapperConfiguration settings)
        {
            if (IsBoostrapped)
                return;
            IsBoostrapped = true;

            _settings = settings;

            _container = new Container(cfg =>
            {
                cfg.AddRegistry(new FrameworkRegistry(_settings));
                cfg.AddRegistry(new PersistenceRegistry(_settings));
            });

            StaticContainer = _container;

            string whatDoIHave = _container.WhatDoIHave();    //For debuging purposes
            string x = _container.WhatDidIScan();    //For debuging purposes
        }
    }
}
