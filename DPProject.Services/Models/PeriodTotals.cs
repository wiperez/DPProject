using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Services.Models
{
    public class PeriodTotals
    {
        public decimal initInvent { get; set; }
        public decimal finalInvent { get; set; }
        public decimal salaries { get; set; }
        public decimal salesTotal { get; set; }
        public decimal purchTotal { get; set; }
    }
}
