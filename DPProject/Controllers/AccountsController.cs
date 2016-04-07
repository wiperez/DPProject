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
    [RoutePrefix("api/Accounts")]
    public class AccountsController : XBaseApiController
    {
        private readonly IAccountService Service;

        public AccountsController(IUnitOfWorkAsync _UnitOfWorkAsync, 
            IAccountService _Service) : base(_UnitOfWorkAsync)
        {
            Service = _Service;
        }

        [HttpGet]
        public IHttpActionResult GetByName(string name)
        {
            try
            {
                var a = Service.Get(name);
                return Ok(a);
            }
            catch (Exception ex)
            {
                return BadRequest<object>(new { ErrorCode = ex.HResult, Message = ex.Message });
            }
        }
    }
}
