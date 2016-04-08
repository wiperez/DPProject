using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class SaleOperationModel
    {
        public int AccountId { get; set; }
        public decimal Amount { get; set; }
        public string Customer { get; set; }
        public string CustomerGroup { get; set; }
        public int CustomerId { get; set; }
        public string Description { get; set; }
        public DateTime OperationDate { get; set; }
        public int PeriodId { get; set; }
    }
}
