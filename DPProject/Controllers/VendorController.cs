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
    [RoutePrefix("api/Vendor")]
    public class VendorController : XBaseApiController
    {
        private readonly IVendorService Service;

        public VendorController(IUnitOfWorkAsync _UnitOfWorkAsync, IVendorService _Service)
            : base(_UnitOfWorkAsync)
        {
            Service = _Service;
        }


        [HttpPost]
        [Route("get")]
        public IHttpActionResult GetVendors(SmartTableParamModel<VendorPredicateModel> M)
        {
            try
            {
                var result = Service.GetVendors(M);
                return Ok(new { list = result.Rows });
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }

        [HttpPost]
        public IHttpActionResult Insert(VendorModel M)
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
        public IHttpActionResult Update(VendorModel M, int Id)
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

    }
}

