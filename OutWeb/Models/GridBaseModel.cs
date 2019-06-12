using OutWeb.Models.api;

namespace OutWeb.Models
{
    public class GridBaseFilterModel
    {
        public int? page { get; set; }

        /// <summary>
        /// 排序欄位
        /// </summary>
        public string field { get; set; }

        /// <summary>
        /// 排序順序
        /// </summary>
        public string sort { get; set; }

        /// <summary>
        /// 查詢條件
        /// </summary>
        public string qry { get; set; }
        /// <summary>
        /// 狀態(上下架)
        /// </summary>
        public string disabled { get; set; }

        public string mode { get; set; }
    }
}