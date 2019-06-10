using LinqKit;
using LUCHANGEntities.DATA;
using OutWeb.Models;
using OutWeb.Models.api;
using OutWeb.Models.NewsModels;
using ProcCore.WebCore;
using System;
using System.Data.Entity;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Http;
using System.Linq.Dynamic;

namespace OutWeb.Controllers.api
{
    [RoutePrefix("api/Front/News")]
    public class NewsFrontController : ApiController
    {
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T">資料表模型</typeparam>
        /// <param name="item_where">IQueryable物件資料</param>
        /// <param name="field">要排序的欄位</param>
        /// <param name="sort">排序順序</param>
        /// <param name="result">回傳排序後資料</param>
        /// <returns>是否有進行排序</returns>
        protected void SortField<T>(IQueryable<T> item_where, string field, string sort, out IQueryable<T> result)
        {
            if (field != null && sort != null && (sort.ToLower() == "asc" || sort.ToLower() == "desc"))
            {
                IQueryable<T> resultOrderItems = null;

                if (sort.ToLower() == "asc")
                    resultOrderItems = item_where.OrderBy(field + ", SORT  descending");

                if (sort.ToLower() == "desc")
                    resultOrderItems = item_where.OrderBy(field + " descending, SORT  descending");
                result = resultOrderItems;
            }
            else
            {
                result = item_where.OrderBy("SORT  descending");
            }
        }

        [Route("List")]
        public async Task<IHttpActionResult> GetList([FromUri]GridBaseFilterModel q)
        {
            GridResultBaseModel result = new GridResultBaseModel();

            int page = q.page == null ? 1 : (int)q.page;
            var predicate = PredicateBuilder.True<NEWS>();

            predicate = predicate.And(x => !x.DISABLED);

            if (!string.IsNullOrEmpty(q.qry))
            {
                q.qry = q.qry.Trim();
                predicate = predicate.And(x => x.TITLE.Contains(q.qry));
            }
            if (!string.IsNullOrEmpty(q.disabled) && !q.disabled.Equals("A"))
            {
                bool filterDisabled = true;
                switch (q.disabled)
                {
                    case "Y":
                        filterDisabled = false;
                        break;

                    case "N":
                        filterDisabled = true;
                        break;
                }
                predicate = predicate.And(x => x.DISABLED == filterDisabled);
            }

            bool isSuccess = true;
            string msg = string.Empty;
            object resultData = null; ;
            using (var db = new LUCHANGDB())
            {
                try
                {
                    var item_where = db.NEWS.AsExpandable().Where(predicate);
                    var item_count = await item_where.CountAsync(); //取得此條件下總筆數

                    //進行排序 或點選欄位排序
                    SortField(item_where, q.field, q.sort, out IQueryable<NEWS> item_order);

                    item_count = item_count <= 0 ? 1 : item_count;
                    int start_record = PageCount.PageInfo(page, item_count, item_count); //計算分頁資訊，取得需跳至開始的那一筆。

                    //轉模型 一次只處理分頁數量的資料

                    resultData = item_order
                    .AsExpandable()
                    .Skip(start_record)
                    .Take(item_count)
                    .AsEnumerable()
                    .Select(s => new ListDataModel()
                    {
                        ID = s.ID,
                        TITLE = s.TITLE,
                        AUTHOR = s.AUTHOR,
                        DISABLED = s.DISABLED,
                        STATUS = s.STATUS,
                        BUD_DT_STR = s.BUD_DT.ToString("yyyy\\-MM\\-dd"),
                        UPD_DT_STR = s.UPD_DT.ToString("yyyy\\-MM\\-dd"),
                        BUD_USR_ID = s.BUD_USR_ID,
                        UPD_USR_ID = s.UPD_USR_ID,
                        CONTENT = !string.IsNullOrEmpty(s.CONTENT) ?
                        s.CONTENT.Length > 60 ? HtmlToPlainText(s.CONTENT.Substring(0, 57)) + "..." : HtmlToPlainText(s.CONTENT) : s.CONTENT,
                        SORT = (float)s.SORT
                    })
                    .ToList();

                    result.page.total = PageCount.TotalPage;
                    result.page.page = PageCount.Page;
                    result.page.records = PageCount.RecordCount;
                    result.page.startcount = PageCount.StartCount;
                    result.page.endcount = PageCount.EndCount;
                    result.page.field = q.field;
                    result.page.sort = q.sort;
                }
                catch (Exception ex)
                {
                    isSuccess = false;
                    msg = ex.Message;
                }
            }
            result.filter = q;
            result.data = resultData;
            result.success = isSuccess;
            result.msg = msg;
            return Ok(result);
        }

        private string HtmlToPlainText(string html)
        {
            const string tagWhiteSpace = @"(>|$)(\W|\n|\r)+<";//matches one or more (white space or line breaks) between '>' and '<'
            const string stripFormatting = @"<[^>]*(>|$)";//match any character between '<' and '>', even when end tag is missing
            const string lineBreak = @"<(br|BR)\s{0,1}\/{0,1}>";//matches: <br>,<br/>,<br />,<BR>,<BR/>,<BR />
            var lineBreakRegex = new Regex(lineBreak, RegexOptions.Multiline);
            var stripFormattingRegex = new Regex(stripFormatting, RegexOptions.Multiline);
            var tagWhiteSpaceRegex = new Regex(tagWhiteSpace, RegexOptions.Multiline);

            var text = html;
            if (!string.IsNullOrWhiteSpace(text))
            {
                //Decode html specific characters
                text = System.Net.WebUtility.HtmlDecode(text);
                //Remove tag whitespace/line breaks
                text = tagWhiteSpaceRegex.Replace(text, "><");
                //Replace <br /> with line breaks
                text = lineBreakRegex.Replace(text, Environment.NewLine);
                //Strip formatting
                text = stripFormattingRegex.Replace(text, string.Empty);
            }

            return text;
        }

        [Route("Edit")]
        public async Task<IHttpActionResult> GetData(int? id)
        {
            JsonResultBase result = new JsonResultBase();
            bool isSuccess = true;
            string msg = string.Empty;

            NEWS data = null;
            using (var db = new LUCHANGDB())
            {
                try
                {
                    data = await db.NEWS.FindAsync(id.Value);

                    if (data == null)
                    {
                        isSuccess = false;
                        msg = "無法找到ID為" + id.Value + "的資料，是否已被刪除?";
                    }
                    else
                    {
                        if (data.DISABLED || !data.STATUS)
                            throw new Exception("該專欄已關閉或刪除");

                        result.data = new ListDataModel()
                        {
                            ID = data.ID,
                            TITLE = data.TITLE,
                            AUTHOR = data.AUTHOR,
                            DISABLED = data.DISABLED,
                            STATUS = data.STATUS,
                            BUD_DT_STR = data.BUD_DT.ToString("yyyy\\-MM\\-dd"),
                            UPD_DT_STR = data.UPD_DT.ToString("yyyy\\-MM\\-dd"),
                            BUD_USR_ID = data.BUD_USR_ID,
                            UPD_USR_ID = data.UPD_USR_ID,
                            CONTENT = data.CONTENT,
                            SORT = (float)data.SORT
                        };
                    }
                }
                catch (Exception ex)
                {
                    isSuccess = false;
                    msg = ex.Message;
                }
            }
            result.msg = msg;
            result.success = isSuccess;

            return Ok(result);
        }
    }
}