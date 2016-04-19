using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class PurchaseModel
    {
        public int PurchaseId { get; set; }
        public int JournalOperationId { get; set; }
        public int VendorId { get; set; }
    }
}
