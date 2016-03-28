using FluentValidation;
using FluentValidation.Results;
using HASELT.Arc.Core;
using HASELT.Arc.Messaging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HASELT.GeoMega.AppServices.Decorators
{
    /// <summary>
    /// Handler responsible for validation input requests.
    /// </summary>
    /// <typeparam name="TRequest"></typeparam>
    /// <typeparam name="TResponse"></typeparam>
    public class ValidatorHandler<TRequest, TResponse> : IRootRequestHandler<TRequest, TResponse>
        where TRequest : IRequest<TResponse>
        where TResponse : IResponse
    {
        protected readonly IRootRequestHandler<TRequest, TResponse> _inner;
        protected readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidatorHandler(IRootRequestHandler<TRequest, TResponse> inner, IEnumerable<IValidator<TRequest>> validators)
        {
            _inner = inner;
            _validators = validators;
        }

        public async Task<Result<TResponse>> Handle(IRequest<TResponse> request)
        {
            var result = new Result<TResponse>();

            var validationFailures = Validate(request);
            if (validationFailures.Any())
            {
                var errors = validationFailures
                    .Select(x => new ResultErrorMessage(x.PropertyName, x.ErrorMessage, x.AttemptedValue));
                result.Exception = new ResultInvalidException { Errors = errors };
                return await Task.FromResult(result);
            }

            try
            {
                return await _inner.Handle(request);
            }
            catch (CoreException ex)
            {
                result.Exception = new ResultInvalidException
                {
                    Errors = new List<ResultErrorMessage>() { new ResultErrorMessage(ex.GetType().ToString(), ex.Message) }
                };
                return await Task.FromResult(result);
            }
            // You can catch more concrete core exceptions and handle them differently.
            //UnauthorizedAccessException
        }

        private IEnumerable<ValidationFailure> Validate(IRequest<TResponse> request)
        {
            var context = new ValidationContext(request);
            return _validators
                .Select(validator => validator.Validate(context))
                .SelectMany(result => result.Errors);
        }
    }
}
