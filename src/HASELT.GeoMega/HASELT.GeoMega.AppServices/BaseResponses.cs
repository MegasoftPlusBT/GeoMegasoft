using HASELT.Arc.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features
{
    public abstract class BaseResponse : IResponse
    {
    }

    /// <summary>
    /// Response with pagination metadata.
    /// </summary>
    public abstract class FilterResponse : BaseResponse
    {
        public PaginationResponse Pagination { get; set; } = new PaginationResponse();

        public class PaginationResponse
        {
            public int Page { get; set; }
            public int PageSize { get; set; }
            public long TotalCount { get; set; }
            public int PageCount => PageSize > 0 ? (int)Math.Ceiling((decimal)TotalCount / PageSize) : 0;
        }
    }
}
