//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DPProject.Data
{
    using System;
    using System.Collections.Generic;
    using Repository.Pattern.Ef6;
    public partial class CustomerGroup : Entity
    {
        public CustomerGroup()
        {
            this.Customers = new HashSet<Customer>();
        }
    
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    
        public virtual ICollection<Customer> Customers { get; set; }
    }
}
