using DPProject.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Services
{
    public interface IStoredProcedureService
    {
        //IEnumerable<CustomerOrderHistory> CustomerOrderHistory(string customerID)
    }

     public class StoredProcedureService : IStoredProcedureService
    {
         private readonly IStoredProcedures SProcedures;

         public StoredProcedureService(IStoredProcedures _storedProcedures)
        {
            SProcedures = _storedProcedures;
        }

         //public IEnumerable<CustomerOrderHistory> CustomerOrderHistory(string customerID)
         //{
         //    return StoredProcedures.CustomerOrderHistory(customerID);
         //}
    }
}
