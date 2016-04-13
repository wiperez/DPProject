using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class SaleOperationModel
    {
        public int operationId { get; set; }
        public int saleId { get; set; }
        public int accountId { get; set; }
        public decimal amount { get; set; }
        public string customer { get; set; }
        public string customerGroup { get; set; }
        public int customerId { get; set; }
        public string description { get; set; }
        public DateTime operationDate { get; set; }
        public int periodId { get; set; }
    }
}
