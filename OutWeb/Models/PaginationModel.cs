using OutWeb.Models.api;

namespace OutWeb.Models
{
    public class PaginationModel 
    {
        public int total;
        public int page;
        public int records;
        public int startcount;
        public int endcount;

        /// <summary>
        /// 排序順序 ASC DESC
        /// </summary>
        public string sort;

        /// <summary>
        /// 目前排序的欄位
        /// </summary>
        public string field;
    }
}