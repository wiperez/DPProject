using System;

namespace DPProject.Repository.Models
{

    public class CustomerPredicateModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }

        public int Groupid { get; set; }
    }


    public class VendorPredicateModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        
    }

    public class ExpensePredicateModel
    {
        public int OperationId { get; set; }
        public string AccountName { get; set; }
        public string Description { get; set; }
        public int AccountId { get; set; }
        public int PeriodId { get; set; }
        public DateTime OperationDate { get; set; }
        public decimal Amount { get; set; }
    }

}
