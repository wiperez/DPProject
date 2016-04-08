using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class SaleListModel
    {
        public string customer { get; set; }
        public string date { get; set; }
        public decimal amount { get; set; }
        public string customerGroup { get; set; }
    }
}
