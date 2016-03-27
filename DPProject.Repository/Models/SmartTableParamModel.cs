
namespace DPProject.Repository.Models
{
    public class SmartTableParamModel<T> where T: class
    {
        
        public SmartTableParamModel(T _Predicate)
        {
            Predicate = _Predicate;
        }

        public T Predicate { get; set; }
        public PaginationModel Pagination { get; set; }
        public SortModel Sort { get; set; }
    }

    public class PaginationModel
    {
        public int Start { get; set; }
        public int Count { get; set; }
        public int Number { get; set; }
    }

    public class SortModel
    {
        public string Predicate { get; set; }
        public bool Reverse { get; set; }
    }

   
}
