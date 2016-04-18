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
    public interface IJournalService : IService<JournalOperation>
    {
        ICollection<JournalModel> GetOperations(int page, int count);
        int Insert(JournalModel M);
        int Insert(SaleOperationModel M);
        void Update(JournalModel M);
        JournalModel Get(int id);
        ICollection<SaleListModel> GetSales(SaleListParams listParams);
        int Update(SaleOperationModel m);
        bool Delete(int operationId);
        ICollection<PurchaseListModel> GetPurchases(PurchaseListParams listParams);
    }

    public class JournalService : Service<JournalOperation>, IJournalService
    {
        private readonly IRepositoryAsync<JournalOperation> Repository;
        private readonly IUnitOfWorkAsync UnitOfWorkAsync;

        public JournalService(IRepositoryAsync<JournalOperation> _Repository, IUnitOfWorkAsync _UnitOfWork)
            : base(_Repository)
        {
            Repository = _Repository;
            UnitOfWorkAsync = _UnitOfWork;
        }

        public bool Delete(int operationId)
        {
            try {
                var j = Find(operationId);
                j.Deleted = true;
                Update(new JournalModel()
                {
                    Id = j.Id,
                    AccountId = j.AccountId,
                    Amount = j.Amount,
                    Deleted = j.Deleted,
                    Description = j.Description,
                    OperationDate = j.OperationDate,
                    PeriodId = j.PeriodId
                });
                UnitOfWorkAsync.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public JournalModel Get(int id)
        {
            throw new NotImplementedException();
        }

        public ICollection<JournalModel> GetOperations(int page, int count)
        {
            throw new NotImplementedException();
        }

        public ICollection<PurchaseListModel> GetPurchases(PurchaseListParams listParams)
        {
            return Repository.GetPurchases(listParams);
        }

        public ICollection<SaleListModel> GetSales(SaleListParams listParams)
        {
            return Repository.GetSales(listParams);
        }

        public int Insert(SaleOperationModel M)
        {
            var accounts = UnitOfWorkAsync.Repository<Account>();
            M.accountId = accounts.Query(a => a.AccountName.Equals("Ventas"))
                .Select().First().AccountId;
            M.periodId = UnitOfWorkAsync.RepositoryAsync<Period>()
                .BelongsTo(M.operationDate);
            var journalId = Insert(new JournalModel()
            {
                AccountId = M.accountId,
                Amount = M.amount,
                Description = M.description,
                OperationDate = M.operationDate,
                PeriodId = M.periodId
            });
            var sales = UnitOfWorkAsync.Repository<Sale>();
            sales.Insert(new Sale()
            {
                CustomerId = M.customerId,
                JournalOperationId = journalId
            });
            UnitOfWorkAsync.SaveChanges();
            return journalId;
        }

        public int Insert(JournalModel M)
        {
            var jOper = new JournalOperation()
            {
                AccountId = M.AccountId,
                Amount = M.Amount,
                PeriodId = M.PeriodId,
                OperationDate = M.OperationDate,
                Description = M.Description
            };
            Insert(jOper);
            UnitOfWorkAsync.SaveChanges();

            return jOper.Id;
        }

        public int Update(SaleOperationModel m)
        {
            Update(new JournalModel()
            {
                AccountId = m.accountId,
                Amount = m.amount,
                Description = m.description,
                OperationDate = m.operationDate,
                PeriodId = m.periodId,
                Id = m.operationId
            });
            var sales = UnitOfWorkAsync.Repository<Sale>();
            var s = sales.Find(m.saleId);
            s.CustomerId = m.customerId;
            sales.Update(s);
            UnitOfWorkAsync.SaveChanges();
            return m.operationId;
        }

        public void Update(JournalModel M)
        {
            var j = Repository.Find(M.Id);
            j.AccountId = M.AccountId;
            j.Amount = M.Amount;
            j.OperationDate = M.OperationDate;
            j.PeriodId = M.PeriodId;
            j.Description = M.Description;
            Update(j);
            UnitOfWorkAsync.SaveChanges();
        }
    }
}
