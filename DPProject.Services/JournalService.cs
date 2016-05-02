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
        int Insert(JournalModel M);
        int Insert(SaleOperationModel M);
        int Insert(PurchaseOperationModel M);

        void Update(JournalModel M);
        int Update(ExpenseModel M);
        int Update(SaleOperationModel m);
        int Update(PurchaseOperationModel m);

        JournalModel Get(int id);
        ICollection<JournalModel> GetOperations(int page, int count);
        ICollection<SaleListModel> GetSales(SaleListParams listParams);
        ICollection<PurchaseListModel> GetPurchases(PurchaseListParams listParams);
        SmartTableModel<ExpenseModel> GetExpenses(SmartTableParamModel<ExpensePredicateModel> M);
        int SaveExpense(ExpenseModel M);
        PeriodTotals GetPeriodTotals(string week);

        bool Delete(int operationId);
        bool DeleteExpense(int operationId);

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

        public bool DeleteExpense(int operationId)
        {
            try
            {
                var j = Find(operationId);
                Delete(j);
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

        public SmartTableModel<ExpenseModel> GetExpenses(SmartTableParamModel<ExpensePredicateModel> M)
        {
            var accounts = Repository.GetRepository<Account>().Queryable();
            var operations = Repository.GetRepository<JournalOperation>().Queryable();

            var parentAccount = accounts.First(a => a.AccountName.Equals("Gastos"))
                .AccountId;

            var expenseElements = from a in accounts
                                  where a.ParentAccount == parentAccount
                                  select new ExpenseModel()
                                  {
                                      AccountName = a.AccountName,
                                      Description = a.AccountDescription,
                                      Amount = 0,
                                      AccountCode = a.AccountCode,
                                      ParentAccount = parentAccount,
                                      AccountId = a.AccountId,
                                      PeriodId = M.Predicate.PeriodId,
                                      OperationId = 0
                                  };

            var journal = from o in operations
                          join a in accounts on o.AccountId equals a.AccountId
                          where o.PeriodId == M.Predicate.PeriodId
                            && a.ParentAccount == parentAccount
                            && o.Deleted == false 
                            && o.OperationDate.Month == M.Predicate.OperationDate.Month
                            && o.OperationDate.Year == M.Predicate.OperationDate.Year 
                          select new
                          {
                              AccountId = a.AccountId,
                              AccountCode = a.AccountCode,
                              Amount = o.Amount,
                              OperationId = o.Id,
                              PeriodId = o.PeriodId,
                              OperationDate = o.OperationDate
                          };

            var result = new List<ExpenseModel>();

            foreach (var el in expenseElements)
            {
                var accountId = el.AccountId;
                var already = journal.Count(o => o.AccountId.Equals(accountId)) > 0
                    ? true : false;
                if (already)
                {
                    var j = journal.First(o => o.AccountId.Equals(accountId));
                    el.Amount = j.Amount;
                    el.OperationId = j.OperationId;
                    el.PeriodId = j.PeriodId;
                    el.OperationDate = DateTime.Parse(string.Format("{0}-{1}-{2}",
                        DateTime.Now.Year, j.PeriodId, "01"));
                }
                if ((string.IsNullOrEmpty(M.Predicate.AccountName) ||
                    el.AccountName.ToLower().Contains(M.Predicate.AccountName.ToLower()))
                    && 
                    (el.Amount.ToString().Contains(M.Predicate.Amount.ToString())))
                {
                    result.Add(el);
                }
            }

            var TList = result.ToList();
            if (!string.IsNullOrEmpty(M.Sort.Predicate))
            {
                TList = TList.OrderBy(string.Format("{0} {1}", M.Sort.Predicate, M.Sort.Reverse ? "DESC" : "ASC")).ToList();
            }

            return new SmartTableModel<ExpenseModel>()
            {
                Rows = TList.Skip(M.Pagination.Start).Take(M.Pagination.Number),
                NumberOfPages = Convert.ToInt32(Math.Ceiling((float)TList.Count() / M.Pagination.Number)),
                Start = M.Pagination.Start,
                Number = M.Pagination.Number,
                RowCount = TList.Count()
            };
        }

        public ICollection<JournalModel> GetOperations(int page, int count)
        {
            throw new NotImplementedException();
        }

        public PeriodTotals GetPeriodTotals(string week)
        {
            var p = week.Split('/');
            var d = DateTime.Parse(string.Format("{0}/{1}/{2}", p[2], p[0], p[1]));
            var currMonth = d.Month;
            var prevMonth = d.AddMonths(-1).Month;
            var year = d.Year;

            var inventAccount = Repository.GetRepository<Account>()
                .Query(a => a.AccountName.Equals("Inventario")).Select()
                .First().AccountId;
            var salaryAccount = Repository.GetRepository<Account>()
                .Query(a => a.AccountName.Equals("Salarios")).Select()
                .First().AccountId;

            var initInvent = Repository.Query(j => j.OperationDate.Day == 1
                    && j.OperationDate.Month == prevMonth
                    && j.OperationDate.Year == year
                    && j.AccountId == inventAccount).Select();
            var finalInvent = Repository.Query(j => j.OperationDate.Day == 1
                    && j.OperationDate.Month == currMonth
                    && j.OperationDate.Year == year
                    && j.AccountId == inventAccount).Select();
            var salaries = Repository.Query(j => j.OperationDate.Day == 1
                    && j.OperationDate.Month == currMonth
                    && j.OperationDate.Year == year
                    && j.AccountId == salaryAccount).Select();

            return new PeriodTotals()
            {
                initInvent = initInvent.Count() == 0 ? 0 : initInvent.First().Amount,
                finalInvent = finalInvent.Count() == 0 ? 0 : finalInvent.First().Amount,
                salaries = salaries.Count() == 0 ? 0 : salaries.First().Amount
            };
        }

        public ICollection<PurchaseListModel> GetPurchases(PurchaseListParams listParams)
        {
            return Repository.GetPurchases(listParams);
        }

        public ICollection<SaleListModel> GetSales(SaleListParams listParams)
        {
            return Repository.GetSales(listParams);
        }

        public int Insert(PurchaseOperationModel M)
        {
            var accounts = UnitOfWorkAsync.Repository<Account>();
            M.accountId = accounts.Query(a => a.AccountName.Equals("Compras"))
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
            var purchases = UnitOfWorkAsync.RepositoryAsync<Purchase>();
            purchases.Insert(new Purchase()
            {
                VendorId = M.vendorId,
                JournalOperationId = journalId
            });
            UnitOfWorkAsync.SaveChanges();
            return journalId;
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

        public int SaveExpense(ExpenseModel M)
        {
            return Insert(new JournalModel()
            {
                AccountId = M.AccountId,
                Amount = M.Amount,
                Description = M.Description,
                OperationDate = M.OperationDate,
                PeriodId = M.PeriodId
            });
        }

        public int Update(ExpenseModel M)
        {
            var j = Repository.Find(M.OperationId);
            j.Amount = M.Amount;
            j.PeriodId = M.PeriodId;
            j.OperationDate = DateTime.Parse(string.Format("{0}-{1}-{2}", 
                DateTime.Now.Year, M.PeriodId, "01"));
            j.Description = M.Description;
            Update(j);
            UnitOfWorkAsync.SaveChanges();
            return j.Id;
        }

        public int Update(PurchaseOperationModel m)
        {
            m.accountId = UnitOfWorkAsync.Repository<Account>()
                .Query(a => a.AccountName.Equals("Compras"))
                .Select().First().AccountId;
            m.periodId = UnitOfWorkAsync.RepositoryAsync<Period>()
                .BelongsTo(m.operationDate);
            Update(new JournalModel()
            {
                AccountId = m.accountId,
                Amount = m.amount,
                Description = m.description,
                OperationDate = m.operationDate,
                PeriodId = m.periodId,
                Id = m.operationId
            });
            var purchases = UnitOfWorkAsync.Repository<Purchase>();
            var s = purchases.Find(m.purchaseId);
            s.VendorId = m.vendorId;
            purchases.Update(s);
            UnitOfWorkAsync.SaveChanges();
            return m.operationId;
        }

        public int Update(SaleOperationModel m)
        {
            m.accountId = UnitOfWorkAsync.Repository<Account>()
                .Query(a => a.AccountName.Equals("Ventas"))
                .Select().First().AccountId;
            m.periodId = UnitOfWorkAsync.RepositoryAsync<Period>()
                .BelongsTo(m.operationDate);
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
