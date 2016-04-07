using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class JournalModel
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int PeriodId { get; set; }
        public System.DateTime OperationDate { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
    }
}
