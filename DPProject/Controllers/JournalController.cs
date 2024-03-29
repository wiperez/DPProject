﻿using Repository.Pattern.UnitOfWork;
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
                return BadRequest<object>(ex);
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
                return BadRequest<object>(ex);
            }
        }

        [HttpPost]
        [Route("purchases")]
        public IHttpActionResult GetPurchases(PurchaseListParams listParams)
        {
            try
            {
                var purchases = Service.GetPurchases(listParams);
                return Ok(new { purchasesList = purchases });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(ex);
            }
        }

        [HttpPut]
        [Route("sale")]
        public IHttpActionResult UpdateSale(SaleOperationModel M)
        {
            try
            {
                var id = Service.Update(M);
                return Ok(new { editedSale = id });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(ex);
            }
        }

        [HttpPut]
        [Route("purchase")]
        public IHttpActionResult UpdatePurchase(PurchaseOperationModel M)
        {
            try
            {
                var id = Service.Update(M);
                return Ok(new { editedSale = id });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(ex);
            }
        }

        [HttpDelete]
        [Route("sale")]
        public IHttpActionResult DeleteSale(int operationId)
        {
            try
            {
                if (Service.Delete(operationId))
                    return Ok(new { success = true });
                else
                    return Ok(new { success = false, message = "See the output for aditional information." });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(ex);
            }
        }

        [HttpDelete]
        [Route("purchase")]
        public IHttpActionResult DeletePurchase(int operationId)
        {
            try
            {
                if (Service.Delete(operationId))
                    return Ok(new { success = true });
                else
                    return Ok(new { success = false, message = "See the output for aditional information." });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(ex);
            }
        }

        [HttpPost]
        [Route("purchase")]
        public IHttpActionResult InsertPurchase(PurchaseOperationModel M)
        {
            try
            {
                return Ok(Service.Insert(M));
            }
            catch (Exception ex)
            {
                return BadRequest<object>(ex);
            }
        }

        [HttpPost]
        [Route("expenses")]
        public IHttpActionResult GetExpenses(SmartTableParamModel<ExpensePredicateModel> M)
        {
            try
            {
                var result = Service.GetExpenses(M);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpPost]
        [Route("expense")]
        public IHttpActionResult SaveExpense(ExpenseModel M)
        {
            try
            {
                var result = Service.SaveExpense(M);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpPut]
        [Route("expense")]
        public IHttpActionResult UpdateExpense(ExpenseModel M)
        {
            try
            {
                Service.Update(M);
                return Ok(new { response = "success" });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpDelete]
        [Route("expense")]
        public IHttpActionResult DeleteExpense(int operationId)
        {
            try
            {
                if (Service.DeleteExpense(operationId))
                    return Ok(new { success = true });
                else
                    return Ok(new { success = false, message = "See the output for aditional information." });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(ex);
            }
        }

        [HttpGet]
        [Route("totals")]
        public IHttpActionResult GetPeriodTotals(string week)
        {
            try
            {
                return Ok(Service.GetPeriodTotals(week));
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

    }

}