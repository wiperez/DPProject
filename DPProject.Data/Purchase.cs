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
    public partial class Purchase : Entity
    {
        public int PurchaseId { get; set; }
        public int JournalOperationId { get; set; }
        public int VendorId { get; set; }
    
        public virtual JournalOperation JournalOperation { get; set; }
        public virtual Vendor Vendor { get; set; }
    }
}
