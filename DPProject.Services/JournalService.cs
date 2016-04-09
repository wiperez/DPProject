﻿using System;
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
            var startDate = listParams.week.Split('-')[0].Trim();
            var endDate = listParams.week.Split('-')[1].Trim();
            var operations = Repository.Queryable();
            var customers = Repository.GetRepository<Customer>().Queryable();
            var groups = Repository.GetRepository<CustomerGroup>().Queryable();
            var sales = Repository.GetRepository<Sale>().Queryable();
            var query = from o in operations
                        join s in sales on o.Id equals s.JournalOperation_Id
                        join c in customers on s.CustomerId equals c.CustomerId
                        join g in groups on c.GroupId equals g.CustomerGroupId
                        select new SaleListModel
                        {
                            amount = o.Amount,
                            customer = c.Name,
                            customerGroup = g.Name,
                            date = o.OperationDate.ToString()
                        };
            return query.ToList();
        }

        public int Insert(SaleOperationModel M)
        {
            var journalId = Insert(new JournalModel()
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

        public void Update(JournalModel M)
        {
            throw new NotImplementedException();
        }
    }
}
