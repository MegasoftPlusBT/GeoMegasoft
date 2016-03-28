using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Dtos
{
    public enum IssueTypeDto
    {
        [Display(Name = "Not set")]
        NotSet = 0,
        [Display(Name = "Task")]
        Task = 1,
        [Display(Name = "Room")]
        Room = 2
    }
}
