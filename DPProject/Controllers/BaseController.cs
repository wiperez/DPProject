using Repository.Pattern.UnitOfWork;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DPProject.Controllers
{
    public abstract class XBaseApiController : ApiController
    {

        public readonly IUnitOfWorkAsync _UnitOfWorkAsync;
        public IUnitOfWorkAsync UnitOfWorkAsync { get { return _UnitOfWorkAsync; } }

        public XBaseApiController(IUnitOfWorkAsync _unitOfWorkAsync)
        {
            _UnitOfWorkAsync = _unitOfWorkAsync;
        }

        /// <summary>
        /// Creates a custom HttpResponseMessage with a Status Code 400 with a custom result.
        /// </summary>
        /// <typeparam name="T">The type of content in the entity body.</typeparam>
        /// <param name="value">The content value to negotiate and format in the entity body.</param>
        /// <returns>Returns a HttpResponseMessage with a 400 Status Code.</returns>
        protected internal virtual IHttpActionResult BadRequest<T>(T value)
        {
            // Get default content negotiator and negotiate type.
            var defaultNegotiator = Configuration.Services.GetContentNegotiator();
            var negotationResult = defaultNegotiator.Negotiate(typeof(T),
                Request, Configuration.Formatters);

            // Create a 400 response message with negotiated content.
            var response = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new ObjectContent<T>(value, negotationResult.Formatter, negotationResult.MediaType)
            };

            return ResponseMessage(response);

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                UnitOfWorkAsync.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
