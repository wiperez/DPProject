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
    public interface IPurchaseService : IService<Purchase>
    {
        ICollection<PurchaseModel> GetSales(int page, int count);
        int Insert(PurchaseModel M);
        void Update(PurchaseModel M);
        PurchaseModel Get(int id);
    }

    public class PurchaseService : Service<Purchase>, IPurchaseService
    {
        private readonly IRepositoryAsync<Purchase> Repository;
        private readonly IUnitOfWorkAsync UnitOfWorkAsync;

        public PurchaseService(IRepositoryAsync<Purchase> _Repository, IUnitOfWorkAsync _UnitOfWork)
            : base(_Repository)
        {
            Repository = _Repository;
            UnitOfWorkAsync = _UnitOfWork;
        }

        public PurchaseModel Get(int id)
        {
            throw new NotImplementedException();
        }

        public ICollection<PurchaseModel> GetSales(int page, int count)
        {
            throw new NotImplementedException();
        }

        public int Insert(PurchaseModel M)
        {
            var purchase = new Purchase()
            {
                VendorId = M.VendorId,
                JournalOperationId = M.JournalOperationId
            };
            Insert(purchase);
            UnitOfWorkAsync.SaveChanges();

            return purchase.PurchaseId;
        }

        public void Update(PurchaseModel M)
        {
            var s = Repository.Find(M.PurchaseId);
            s.VendorId = M.VendorId;
            Update(s);
            UnitOfWorkAsync.SaveChanges();
        }
    }
}
