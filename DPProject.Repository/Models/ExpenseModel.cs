using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class ExpenseModel
    {
        public int OperationId { get; set; }
        public string Description { get; set; }
        public int AccountId { get; set; }
        public int PeriodId { get; set; }
        public string AccountCode { get; set; }
        public int ParentAccount { get; set; }
        public string AccountName { get; set; }
        public decimal Amount { get; set; }
    }
}
