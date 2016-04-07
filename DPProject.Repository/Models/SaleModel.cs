using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class SaleModel
    {
        public int SaleId { get; set; }
        public int JournalOperation_Id { get; set; }
        public int CustomerId { get; set; }
    }
}
