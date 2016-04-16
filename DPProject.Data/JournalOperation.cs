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
    public partial class JournalOperation : Entity
    {
        public JournalOperation()
        {
            this.Purchases = new HashSet<Purchase>();
            this.Sales = new HashSet<Sale>();
        }
    
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int PeriodId { get; set; }
        public System.DateTime OperationDate { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public bool Deleted { get; set; }
    
        public virtual Account Account { get; set; }
        public virtual Period Period { get; set; }
        public virtual ICollection<Purchase> Purchases { get; set; }
        public virtual ICollection<Sale> Sales { get; set; }
    }
}
