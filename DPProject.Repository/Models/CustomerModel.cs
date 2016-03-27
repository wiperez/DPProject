using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Repository.Models
{
    public class CustomerModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public int GroupId { get; set; }
        public string GroupName { get; set; }
    }
}
