using HASELT.Arc.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Features
{
    public abstract class BaseRequest<TResponse> : IRequest<TResponse>
        where TResponse : BaseResponse
    {
    }

    /// <summary>
    /// Request with pagination metadata.
    /// </summary>
    /// <typeparam name="TResponse"></typeparam>
    public abstract class FilterRequest<TResponse> : BaseRequest<TResponse>
        where TResponse : BaseResponse
    {
        public PaginationRequest Pagination { get; set; } = new PaginationRequest();

        public class PaginationRequest
        {
            private int _page = 1;
            public int Page { get { return _page; } set { _page = value >= 1 ? value : 1; } }

            private int _pageSize = 30;
            public int PageSize { get { return _pageSize; } set { _pageSize = value >= 30 ? value : 30; } }

            internal int SkipCount => (Page - 1) * PageSize;
            internal int TakeCount => PageSize;
        }
    }
}
