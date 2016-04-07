using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class AccountModel
    {
        public int AccountId { get; set; }
        public string AccountCode { get; set; }
        public int ParentAccount { get; set; }
        public string AccountName { get; set; }
        public string AccountDescription { get; set; }
    }
}
