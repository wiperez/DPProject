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
    public static class CustomerRepository
    {
        public static IEnumerable<CustomerModel> GetCustomers(this IRepositoryAsync<Customer> repository, SmartTableParamModel<CustomerPredicateModel> P)
        {
            return repository.Queryable()
                .Where(
                    i => (
                        (string.IsNullOrEmpty(P.Predicate.Code) || i.Code.Contains(P.Predicate.Code))
                        && (string.IsNullOrEmpty(P.Predicate.Name) || i.Code.Contains(P.Predicate.Name))
                        && (P.Predicate.Groupid == 0 || i.GroupId == P.Predicate.Groupid)
                    )
                )
                .Select(i => new CustomerModel() { 
                    Id = i.Id,
                    Code = i.Code,
                    Name = i.Name,
                    GroupId = i.GroupId,
                    GroupName = i.CustomerGroup.Name
                });
        }
    }
}
