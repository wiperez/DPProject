using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class SaleListParams
    {
        public int page { get; set; }
        public int count { get; set; }
        public int period { get; set; }
        public int week { get; set; }
    }
}
