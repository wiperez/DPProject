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
    public static class JournalRepository
    {
        public static ICollection<SaleListModel> GetSales(this IRepositoryAsync<JournalOperation> repository, SaleListParams listParams)
        {
            var startDay = Convert.ToInt32(listParams.week.Split('-')[0].Split('/')[1]);
            var endDay = Convert.ToInt32(listParams.week.Split('-')[1].Split('/')[1]);
            var operations = repository.Queryable();
            var customers = repository.GetRepository<Customer>().Queryable();
            var groups = repository.GetRepository<CustomerGroup>().Queryable();
            var sales = repository.GetRepository<Sale>().Queryable();
            var query = from o in operations
                        join s in sales on o.Id equals s.JournalOperation_Id
                        join c in customers on s.CustomerId equals c.CustomerId
                        join g in groups on c.GroupId equals g.CustomerGroupId
                        where o.OperationDate.Day >= startDay && o.OperationDate.Day <= endDay
                            && o.Deleted == false
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

        public static ICollection<PurchaseListModel> GetPurchases(this IRepositoryAsync<JournalOperation> repository, PurchaseListParams listParams)
        {
            throw new NotImplementedException();
        }
    }
}
