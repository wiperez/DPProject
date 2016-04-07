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
    public interface IPeriodService : IService<Period>
    {
        ICollection<PeriodModel> GetPeriods(int page, int count);
        int Insert(PeriodModel M);
        void Update(PeriodModel M);
        PeriodModel Get(string name);
        int BelongsTo(DateTime d);
    }

    public class PeriodService : Service<Period>, IPeriodService
    {
        private readonly IRepositoryAsync<Period> Repository;
        private readonly IUnitOfWorkAsync UnitOfWorkAsync;

        public PeriodService(IRepositoryAsync<Period> _Repository, IUnitOfWorkAsync _UnitOfWork)
            : base(_Repository)
        {
            Repository = _Repository;
            UnitOfWorkAsync = _UnitOfWork;
        }

        public int BelongsTo(DateTime d)
        {
            foreach (var period in Repository.Query().Select())
            {
                if (period.StartDate < d && period.EndDate > d)
                {
                    return period.Id;
                }
            }
            return 0;
        }

        public PeriodModel Get(string name)
        {
            throw new NotImplementedException();
        }

        public ICollection<PeriodModel> GetPeriods(int page, int count)
        {
            throw new NotImplementedException();
        }

        public int Insert(PeriodModel M)
        {
            throw new NotImplementedException();
        }

        public void Update(PeriodModel M)
        {
            throw new NotImplementedException();
        }
    }
}
