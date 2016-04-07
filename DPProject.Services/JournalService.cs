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
        void Update(JournalModel M);
        JournalModel Get(int id);
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
