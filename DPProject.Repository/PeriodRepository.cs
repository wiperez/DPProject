using Repository.Pattern.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DPProject.Data;
using DPProject.Repository.Models;

namespace DPProject.Repository
{
    public static class PeriodRepository
    {
        public static int BelongsTo(this IRepositoryAsync<Period> repository, DateTime d)
        {
            foreach (var period in repository.Query().Select())
            {
                if (period.StartDate < d && period.EndDate > d)
                {
                    return period.Id;
                }
            }
            return 0;
        }
    }
}
