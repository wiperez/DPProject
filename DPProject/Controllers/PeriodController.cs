using Repository.Pattern.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DPProject.Services;
using DPProject.Repository.Models;

namespace DPProject.Controllers
{
    [RoutePrefix("api/Period")]
    public class PeriodController : XBaseApiController
    {
        private readonly IPeriodService Service;

        public PeriodController(IUnitOfWorkAsync _UnitOfWorkAsync, IPeriodService _Service)
            : base(_UnitOfWorkAsync)
        {
            Service = _Service;
        }

        [HttpGet]
        [Route("belongs")]
        public IHttpActionResult BelongsTo(string date)
        {
            try
            {
                var result = Service.BelongsTo(DateTime.Parse(date));
                return Ok(new { periodId = result });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

    }
}