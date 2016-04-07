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
    public class SaleOperationModel
    {
        public int AccountId { get; set; }
        public decimal Amount { get; set; }
        public string Customer { get; set; }
        public string CustomerGroup { get; set; }
        public int CustomerId { get; set; }
        public string Description { get; set; }
        public DateTime OperationDate { get; set; }
        public int PeriodId { get; set; }
    }

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
                var journalId = Service.Insert(new JournalModel()
                {
                    AccountId = M.AccountId,
                    Amount = M.Amount,
                    Description = M.Description,
                    OperationDate = M.OperationDate,
                    PeriodId = M.PeriodId
                });
                var sales = UnitOfWorkAsync.Repository<Sale>();
                sales.Insert(new Sale()
                {
                    CustomerId = M.CustomerId,
                    JournalOperation_Id = journalId
                });
                UnitOfWorkAsync.SaveChanges();
                return Ok(journalId);
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }
    }
}