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

        public JournalModel Get(int id)
        {
            throw new NotImplementedException();
        }

        public ICollection<JournalModel> GetOperations(int page, int count)
        {
            throw new NotImplementedException();
        }

        public ICollection<SaleListModel> GetSales(SaleListParams listParams)
        {
            var startDay = Convert.ToInt32(listParams.week.Split('-')[0].Split('/')[1]);
            var endDay = Convert.ToInt32(listParams.week.Split('-')[1].Split('/')[1]);
            var operations = Repository.Queryable();
            var customers = Repository.GetRepository<Customer>().Queryable();
            var groups = Repository.GetRepository<CustomerGroup>().Queryable();
            var sales = Repository.GetRepository<Sale>().Queryable();
            var query = from o in operations
                        join s in sales on o.Id equals s.JournalOperation_Id
                        join c in customers on s.CustomerId equals c.CustomerId
                        join g in groups on c.GroupId equals g.CustomerGroupId
                        where o.OperationDate.Day >= startDay && o.OperationDate.Day <= endDay
                        select new SaleListModel
                        {
                            operationId = o.Id,
                            amount = o.Amount,
                            customer = c.Name,
                            customerId = c.CustomerId,
                            customerGroup = g.Name,
                            saleId = s.SaleId,
                            operationDate = o.OperationDate.ToString(),
                            description = o.Description
                        };
            return query.ToList();
        }

        public int Insert(SaleOperationModel M)
        {
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
                JournalOperation_Id = journalId
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
