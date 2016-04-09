using Repository.Pattern.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DPProject.Services;
using DPProject.Data;
using DPProject.Repository.Models;

namespace DPProject.Controllers
{
    [RoutePrefix("api/Journal")]
    public class JournalController : XBaseApiController
    {
        private readonly IJournalService Service;

        public JournalController(IUnitOfWorkAsync _UnitOfWorkAsync, IJournalService _Service)
            : base(_UnitOfWorkAsync)
        {
            Service = _Service;
        }

        [HttpPost]
        [Route("sale")]
        public IHttpActionResult InsertSale(SaleOperationModel M)
        {
            try
            {
                return Ok(Service.Insert(M));
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpPost]
        [Route("sales")]
        public IHttpActionResult GetSales(SaleListParams listParams)
        {
            try
            {
                var sales = Service.GetSales(listParams);
                return Ok(new { saleList = sales });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }
    }

    public class SaleRecord
    {
        public string customer { get; set; }
        public string date { get; set; }
        public decimal amount { get; set; }
        public string customerGroup { get; set; }
    }
}