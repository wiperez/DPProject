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
    public interface IAccountService : IService<Account>
    {
        ICollection<AccountModel> GetAccounts(int page, int count);
        int Insert(AccountModel M);
        void Update(AccountModel M);
        AccountModel Get(string name);
    }

    public class AccountService : Service<Account>, IAccountService
    {
        private readonly IRepositoryAsync<Account> Repository;
        private readonly IUnitOfWorkAsync UnitOfWorkAsync;

        public AccountService(IRepositoryAsync<Account> _Repository, IUnitOfWorkAsync _UnitOfWork)
            : base(_Repository)
        {
            Repository = _Repository;
            UnitOfWorkAsync = _UnitOfWork;
        }

        public AccountModel Get(string name)
        {
            var A = Repository.Query(a => a.AccountName == name).Select().First();
            return new AccountModel()
            {
                AccountCode = A.AccountCode,
                AccountId = A.AccountId,
                AccountName = A.AccountName,
                ParentAccount = A.ParentAccount,
                AccountDescription = A.AccountDescription
            };
        }

        public ICollection<AccountModel> GetAccounts(int page, int count)
        {
            throw new NotImplementedException();
        }

        public int Insert(AccountModel M)
        {
            throw new NotImplementedException();
        }

        public void Update(AccountModel M)
        {
            throw new NotImplementedException();
        }

    }
}
