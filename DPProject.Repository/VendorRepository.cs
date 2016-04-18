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
    public static class VendorRepository
    {
        public static IEnumerable<VendorModel> GetVendors(this IRepositoryAsync<Vendor> repository, SmartTableParamModel<VendorPredicateModel> P)
        {
            return repository.Queryable()
                .Where(
                    i => (
                        (string.IsNullOrEmpty(P.Predicate.Description) || i.Description.Contains(P.Predicate.Description))
                        && (string.IsNullOrEmpty(P.Predicate.Name) || i.Name.Contains(P.Predicate.Name))
                    )
                )
                .Select(i => new VendorModel()
                {
                    VendorId = i.VendorId,
                    Description = i.Description,
                    Name = i.Name
                });
        }

    }
}
