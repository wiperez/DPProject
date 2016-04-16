using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class PurchaseListModel
    {
        public int operationId { get; set; }
        public int purchaseId { get; set; }
        public string vendor { get; set; }
        public int vendorId { get; set; }
        public string operationDate { get; set; }
        public decimal amount { get; set; }
        public string description { get; set; }
    }
}
