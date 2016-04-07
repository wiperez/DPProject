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
    public interface ICustomerService: IService<Customer>
    {
        SmartTableModel<CustomerModel> GetCustomers(SmartTableParamModel<CustomerPredicateModel> M);
        IEnumerable<CustomerGroup> GetCustomerGroups();
        int Insert(CustomerModel M);
        void Update(CustomerModel M, int Id);
        CustomerModel GetCustomer(string name);
    }

    public class CustomerService : Service<Customer>, ICustomerService
    {
        private readonly IRepositoryAsync<Customer> Repository;
        private readonly IUnitOfWorkAsync UnitOfWorkAsync;

        public CustomerService(IRepositoryAsync<Customer> _Repository, IUnitOfWorkAsync _UnitOfWork)
            : base(_Repository)
        {
            Repository = _Repository;
            UnitOfWorkAsync = _UnitOfWork;
        }


        public SmartTableModel<CustomerModel> GetCustomers(SmartTableParamModel<CustomerPredicateModel> M) 
        {

            var RecordSet = Repository.GetCustomers(M);

            var TList = RecordSet.ToList();

            if (!string.IsNullOrEmpty(M.Sort.Predicate))
            {
                TList = TList.OrderBy(string.Format("{0} {1}", M.Sort.Predicate, M.Sort.Reverse? "DESC" : "ASC")).ToList();
            }

            return new SmartTableModel<CustomerModel>()
            {
                Rows = TList.Skip(M.Pagination.Start).Take(M.Pagination.Number),
                NumberOfPages = Convert.ToInt32(Math.Ceiling((float)TList.Count() / M.Pagination.Number)),
                Start = M.Pagination.Start,
                Number = M.Pagination.Number,
                RowCount = TList.Count()
            };

        }

        public IEnumerable<CustomerGroup> GetCustomerGroups()
        {
            return Repository.GetRepository<CustomerGroup>()
                .Query().Select();
        }

        public int Insert(CustomerModel M)
        {
            var Customer = new Customer()
            {
                Code = M.Code,
                Name = M.Name,
                GroupId = M.GroupId
            };
            Insert(Customer);
            UnitOfWorkAsync.SaveChanges();

            return Customer.CustomerId;
        }

        public void Update(CustomerModel M, int Id)
        {
            var Customer = Repository.Find(Id);
            Customer.Code = M.Code;
            Customer.Name = M.Name;
            Customer.GroupId = M.GroupId;

            Update(Customer);
            UnitOfWorkAsync.SaveChanges();
        }

        public CustomerModel GetCustomer(string name)
        {
            var customers = Repository.Queryable();
            var customerGroups = Repository.GetRepository<CustomerGroup>().Queryable();
            var customerQuery = from c in customers
                           join gn in customerGroups
                           on c.GroupId equals gn.CustomerGroupId
                           where c.Name == name
                           select new CustomerModel()
            {
                Code = c.Code,
                GroupId = c.GroupId,
                GroupName = gn.Name,
                Id = c.CustomerId,
                Name = c.Name
            };
            return customerQuery.First();
        }
    }
}
