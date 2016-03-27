using DPProject.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DPProject.Services.Models
{

    public class SmartTableModel<T> where T : class
    {
        public IEnumerable<T> Rows { get; set; }
        public int Start { get; set; }// start index
        public int Number { get; set; }//number of item on a page
        public int NumberOfPages { get; set; }//total number of pages
        public int RowCount { get; set; }

    }
}
