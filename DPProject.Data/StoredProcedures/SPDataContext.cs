#region

using System;
using System.Collections.Generic;
using System.Data.SqlClient;

#endregion

namespace DPProject.Data
{
    public partial class domiprofEntities : IStoredProcedures
    {
        //public IEnumerable<CustomerOrderHistory> CustomerOrderHistory(string customerID)
        //{
        //    var customerIDParameter = customerID != null ?
        //        new SqlParameter("@CustomerID", customerID) :
        //        new SqlParameter("@CustomerID", typeof(string));

        //    return Database.SqlQuery<CustomerOrderHistory>("CustOrderHist @CustomerID", customerIDParameter);
        //}

        //public int CustOrdersDetail(int? orderID)
        //{
        //    var orderIDParameter = orderID.HasValue ?
        //        new SqlParameter("@OrderID", orderID) :
        //        new SqlParameter("@OrderID", typeof(int));

        //    return Database.ExecuteSqlCommand("CustOrdersDetail @OrderId", orderIDParameter);
        //}

    }
}