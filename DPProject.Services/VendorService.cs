using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Threading.Tasks;
using Repository.Pattern.Infrastructure;
using Repository.Pattern.Repositories;
using Repository.Pattern.UnitOfWork;
using Service.Pattern;
using DPProject.Repository;
using DPProject.Repository.Models;
using DPProject.Services.Models;
using DPProject.Data;

namespace DPProject.Services
{
    public interface IVendorService : IService<Vendor>
    {
        SmartTableModel<VendorModel> GetVendors(SmartTableParamModel<VendorPredicateModel> M);
        int Insert(VendorModel M);
        void Update(VendorModel M, int Id);
    }

    public class VendorService : Service<Vendor>, IVendorService
    {
        private readonly IRepositoryAsync<Vendor> Repository;
        private readonly IUnitOfWorkAsync UnitOfWorkAsync;

        public VendorService(IRepositoryAsync<Vendor> _Repository, IUnitOfWorkAsync _UnitOfWork)
            : base(_Repository)
        {
            Repository = _Repository;
            UnitOfWorkAsync = _UnitOfWork;
        }


        public SmartTableModel<VendorModel> GetVendors(SmartTableParamModel<VendorPredicateModel> M)
        {
            var RecordSet = Repository.GetVendors(M);
            var TList = RecordSet.ToList();
            if (!string.IsNullOrEmpty(M.Sort.Predicate))
            {
                TList = TList.OrderBy(string.Format("{0} {1}", M.Sort.Predicate, M.Sort.Reverse ? "DESC" : "ASC")).ToList();
            }
            return new SmartTableModel<VendorModel>()
            {
                Rows = TList.Skip(M.Pagination.Start).Take(M.Pagination.Number),
                NumberOfPages = Convert.ToInt32(Math.Ceiling((float)TList.Count() / M.Pagination.Number)),
                Start = M.Pagination.Start,
                Number = M.Pagination.Number,
                RowCount = TList.Count()
            };
        }

        public int Insert(VendorModel M)
        {
            var Vendor = new Vendor()
            {
                Name = M.Name,
                Description = M.Description
            };
            Insert(Vendor);
            UnitOfWorkAsync.SaveChanges();

            return Vendor.VendorId;
        }

        public void Update(VendorModel M, int Id)
        {
            var Vendor = Repository.Find(Id);
            Vendor.Name = M.Name;
            Vendor.Description = M.Description;

            Update(Vendor);
            UnitOfWorkAsync.SaveChanges();
        }

    }
}
