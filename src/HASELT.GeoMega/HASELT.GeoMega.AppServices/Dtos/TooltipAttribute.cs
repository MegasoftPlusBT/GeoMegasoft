using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Dtos
{
    public class TooltipAttribute : DescriptionAttribute
    {
        public TooltipAttribute()
            : base("")
        {

        }

        public TooltipAttribute(string description)
            : base(description)
        {

        }
    }
}
