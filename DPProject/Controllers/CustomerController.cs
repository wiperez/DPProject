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
    [RoutePrefix("api/Customer")]
    public class CustomerController : XBaseApiController
    {
        private readonly ICustomerService Service;

        public CustomerController(IUnitOfWorkAsync _UnitOfWorkAsync, ICustomerService _Service)
            : base(_UnitOfWorkAsync)
        {
            Service = _Service;
        }


        [HttpPost]
        [Route("get")]
        public IHttpActionResult GetCustomers(SmartTableParamModel<CustomerPredicateModel> M)
        {
            try
            {
                var result = Service.GetCustomers(M);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult Insert(CustomerModel M)
        {
            try
            {
                var Id = Service.Insert(M);
                return Ok(new { id = Id });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpPut]
        public IHttpActionResult Update(CustomerModel M, int Id)
        {
            try
            {
                Service.Update(M, Id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpGet]
        [Route("group")]
        public IHttpActionResult GetCustomerGroups()
        {
            try
            {
                var result = Service.GetCustomerGroups();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

    }
}
