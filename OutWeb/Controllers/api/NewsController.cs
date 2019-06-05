using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace OutWeb.Controllers.api
{
    [RoutePrefix("api/News")]
    public class NewsController : ApiController
    {
        /// <summary>
        /// 取得查詢資料及Grid Page資料
        /// </summary>
        /// <param name="q"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IHttpActionResult> Get([FromUri] QGet q)
        {
            var r = new ResultData<GridInfo<News>>();
            int page = q.page == null ? 1 : (int)q.page;
            JsonParam data = new JsonParam();
            var list = data.Item;
            #region 搜尋條件
            if (q.keyword != null)
                list = list.Where(x => x.news_title.Contains(q.keyword)).ToList();
            #endregion
            int defPageSize = 10;//每頁顯示十筆
            int start_record = PageCount.PageInfo(page, defPageSize, list.Count()); //計算分頁資訊，取得需跳至開始的那一筆。
            var get_item = list
                   .Select(x => new News()
                   {
                       news_id = x.news_id,
                       news_title = x.news_title,
                       day = x.day,
                       state = x.state
                   })
                   .Skip(start_record)
                   .Take(defPageSize)
                   .ToList();

            r.state = 0; //設定狀態 0:正常
            r.exist = get_item.Any();
            r.data = new GridInfo<News>()
            {
                rows = get_item,
                total = PageCount.TotalPage,
                page = PageCount.Page,
                records = PageCount.RecordCount,
                startcount = PageCount.StartCount,
                endcount = PageCount.EndCount,
                field = q._field,
                sort = q._sort
            };
            return Ok(r);
        }

        /// <summary>
        /// 取得單一資料
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [Route("Item")]
        [HttpGet]
        public async Task<IHttpActionResult> Item([FromUri] QItem p)
        {
            var r = new ResultData<News>();
            var id = p.id;
            JsonParam data = new JsonParam();
            var list = data.Item;
            var item = list.FirstOrDefault(x => x.news_id == id);
            r.state = 0;
            r.data = item;
            r.exist = item != null;
            return Ok(r);
        }
        /// <summary>
        /// 新增
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IHttpActionResult> Post([FromBody] PostData p)
        {
            var r = new ResultBase();
            var md = p.md;
            var id = p.id;
            JsonParam data = new JsonParam();
            var list = data.Item;

            list.Add(md);
            data.SaveData(list);
            r.state = 0;
            return Ok(r);
        }

        /// <summary>
        /// 修改
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [Route("Update")]
        [HttpPost]
        public async Task<IHttpActionResult> Put([FromBody] PutData p)
        {
            var r = new ResultBase();
            var md = p.md;
            var id = p.id;
            JsonParam data = new JsonParam();
            var list = data.Item;

            var item = list.FirstOrDefault(x => x.news_id == id);
            item.news_title = md.news_title;
            item.news_content = md.news_content;
            item.sort = md.sort;
            item.day = md.day;
            item.state = md.state;
            md.upt_date = DateTime.Now;
            md.upt_id = "AAA";

            data.SaveData(list);
            r.state = 0;
            return Ok(r);
        }

        /// <summary>
        /// 刪除
        /// </summary>
        /// <param name="p"></param>
        /// <returns></returns>
        [Route("Remove")]
        [HttpPost]
        public async Task<IHttpActionResult> Delete([FromBody] QItem p)
        {
            var r = new ResultBase();
            var id = p.id;
            JsonParam data = new JsonParam();
            var list = data.Item;
            var item = list.FirstOrDefault(x => x.news_id == id);
            list.Remove(item);
            data.SaveData(list);
            r.state = 0;
            return Ok(r);
        }
        #region 模型定義(先放在這裡)
        #region 搜尋模型定義
        public class PBase
        {
            public string device { get; set; }
            public string account { get; set; }
            public string csrf_token { get; set; }
        }
        /// <summary>
        /// 多條件查詢參數
        /// </summary>
        public class QGet : PBase
        {
            public string keyword { get; set; }
            public string state { get; set; }
            public DateTime? day { get; set; }
            public int? page { get; set; }
            //public string en_login_id { get; set; }
            /// <summary>
            /// 排序欄位
            /// </summary>
            public string _field { get; set; }
            /// <summary>
            /// 排序順序
            /// </summary>
            public string _sort { get; set; }
        }
        /// <summary>
        /// 取得單一一筆資料
        /// </summary>
        public class QItem : PBase
        {
            public int id { get; set; }
        }
        /// <summary>
        /// Post 物件參數
        /// </summary>
        public class PostData : PBase
        {
            public int id { get; set; }
            public News md { get; set; }
        }
        /// <summary>
        /// Put 物件參數 加Id
        /// </summary>
        public class PutData : PBase
        {
            public int id { get; set; }
            public News md { get; set; }
        }
        #endregion
        public class News
        {
            public int news_id { get; set; }
            public string news_title { get; set; }
            public DateTime day { get; set; }
            public string news_content { get; set; }
            public int? sort { get; set; }
            public string state { get; set; }//A顯示;S隱藏
            public string ins_id { get; set; }
            public DateTime? ins_date { get; set; }
            public string upt_id { get; set; }
            public DateTime? upt_date { get; set; }
            public string lang { get; set; }
        }
        /// <summary>
        /// 回傳基礎類別
        /// </summary>
        public class ResultBase
        {
            /// <summary>
            /// 回傳狀態
            /// </summary>
            public int state { get; set; }
            /// <summary>
            /// 回傳訊息
            /// </summary>
            public string message { get; set; }
            /// <summary>
            /// 附加資料 如JSON
            /// </summary>
            public object append { get; set; }
        }
        public class ResultData<T> : ResultBase
        {
            public T data { get; set; }
            /// <summary>
            /// 資料是否存在
            /// </summary>
            public bool exist { get; set; }
        }
        public class GridInfo<T>
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
            public List<T> rows;
        }
        #endregion
        #region 方法
        public static class PageCount
        {
            public static int PageInfo(int page, int pagesize, int recordCount)
            {
                RecordCount = recordCount;
                Page = page <= 0 ? 1 : page;
                Decimal c = Convert.ToDecimal(RecordCount) / pagesize;
                TotalPage = (RecordCount > 0 && pagesize > 0 && pagesize < RecordCount) ? Convert.ToInt32(Math.Ceiling(c)) : 1;
                Page = (Page > TotalPage) ? TotalPage : Page;
                StartCount = (Page - 1) * pagesize + 1;
                EndCount = Page * pagesize > recordCount ? recordCount : Page * pagesize;

                return (Page - 1) * pagesize;
            }
            public static int TotalPage { get; set; }
            public static int RecordCount { get; set; }
            public static int Page { get; set; }
            public static int StartCount { get; set; }
            public static int EndCount { get; set; }
        }
        public class JsonParam
        {
            private IList<News> _data = null;
            public JsonParam()
            {
                var path = HttpContext.Current.Server.MapPath("~/JSON/news.json");
                string text = File.ReadAllText(path);
                _data = JsonConvert.DeserializeObject<IList<News>>(text);
            }
            public IList<News> Item
            {
                get { return _data; }
                set { _data = value; }
            }
            public void SaveData(IList<News> groups)
            {
                _data = groups;
                Save();
            }
            public void Save()
            {
                var context = JsonConvert.SerializeObject(_data);
                var path = HttpContext.Current.Server.MapPath("~/JSON/news.json");
                File.WriteAllText(path, context, Encoding.UTF8);
            }
        }
        #endregion
    }
}