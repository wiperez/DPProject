using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class SaleListModel
    {
        public int id { get; set; }
        public int saleId { get; set; }
        public string customer { get; set; }
        public int customerId { get; set; }
        public string date { get; set; }
        public decimal amount { get; set; }
        public string customerGroup { get; set; }
        public string description { get; set; }
    }
}
