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
    public interface ISaleService : IService<Sale>
    {
        ICollection<SaleModel> GetSales(int page, int count);
        int Insert(SaleModel M);
        void Update(SaleModel M);
        SaleModel Get(int id);
    }

    public class SaleService : Service<Sale>, ISaleService
    {
        private readonly IRepositoryAsync<Sale> Repository;
        private readonly IUnitOfWorkAsync UnitOfWorkAsync;

        public SaleService(IRepositoryAsync<Sale> _Repository, IUnitOfWorkAsync _UnitOfWork)
            : base(_Repository)
        {
            Repository = _Repository;
            UnitOfWorkAsync = _UnitOfWork;
        }

        public SaleModel Get(int id)
        {
            throw new NotImplementedException();
        }

        public ICollection<SaleModel> GetSales(int page, int count)
        {
            throw new NotImplementedException();
        }

        public int Insert(SaleModel M)
        {
            var sale = new Sale()
            {
                CustomerId = M.CustomerId,
                JournalOperation_Id = M.JournalOperation_Id
            };
            Insert(sale);
            UnitOfWorkAsync.SaveChanges();

            return sale.SaleId;
        }

        public void Update(SaleModel M)
        {
            var s = Repository.Find(M.SaleId);
            s.CustomerId = M.CustomerId;
            Update(s);
            UnitOfWorkAsync.SaveChanges();
        }
    }
}
