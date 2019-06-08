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
using System.Web;
using System.Web.Http;

namespace OutWeb.Controllers.api
{
    [Authorize]
    [RoutePrefix("api/News")]
    public class NewsController : BaseApiController
    {
        private int GetUserID()
        {
            var id = HttpContext.Current.Request.Cookies[WebSetup.Cookie_LoginId].Value;
            if (string.IsNullOrEmpty(id))
                throw new Exception("無法取得使用者登入資訊");
            return Convert.ToInt32(id);
        }

        [Route("List")]
        public async Task<IHttpActionResult> GetList([FromUri]GridBaseFilterModel q)
        {
            GridResultBaseModel result = new GridResultBaseModel();

            int page = q.page == null ? 1 : (int)q.page;
            var predicate = PredicateBuilder.True<NEWS>();

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

                    int start_record = PageCount.PageInfo(page, defPageSize, item_count); //計算分頁資訊，取得需跳至開始的那一筆。

                    //轉模型 一次只處理分頁數量的資料

                    resultData = item_order
                    .AsExpandable()
                    .Skip(start_record)
                    .Take(defPageSize)
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
                        CONTENT = s.CONTENT,
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

        [Route("Save")]
        public async Task<IHttpActionResult> SaveData([FromBody] DataModel data)
        {
            JsonResultBase result = new JsonResultBase();
            bool isSuccess = true;
            string msg = string.Empty;
            string url = string.Empty;
            NEWS source = null;
            using (var db = new LUCHANGDB())
            {
                try
                {
                    int userId = GetUserID();
                    if (data.ID.HasValue)
                    {
                        source = await db.NEWS.FindAsync(data.ID.Value);
                    }
                    else
                    {
                        source = new NEWS() { BUD_DT = DateTime.UtcNow.AddHours(8), BUD_USR_ID = userId };
                    }

                    source.AUTHOR = data.AUTHOR;
                    source.TITLE = data.TITLE;
                    source.SORT = data.SORT;
                    source.CONTENT = data.CONTENT;
                    source.DISABLED = data.DISABLED;
                    source.STATUS = data.STATUS;
                    source.UPD_DT = DateTime.UtcNow.AddHours(8);
                    source.UPD_USR_ID = userId;

                    if (data.ID.HasValue)
                        db.Entry(source).State = EntityState.Modified;
                    else
                        db.NEWS.Add(source);

                    await db.SaveChangesAsync();
                    url = "/_SysAdm/Edit?id=" + source.ID;
                }
                catch (Exception ex)
                {
                    isSuccess = false;
                    msg = ex.Message;
                    url = "/_SysAdm/Login";
                }
            }
            result.url = url;
            result.msg = msg;
            result.success = isSuccess;
            return Ok(result);
        }

        [Route("Remove")]
        [HttpPost]
        public async Task<IHttpActionResult> RemoveData([FromBody]DataModel data)
        {
            JsonResultBase result = new JsonResultBase();
            bool isSuccess = true;
            string msg = string.Empty;
            string url = string.Empty;
            using (var db = new LUCHANGDB())
            {
                try
                {
                    var source = await db.NEWS.FindAsync(data.ID);
                    if (source != null)
                    {
                        db.Entry(source).State = EntityState.Deleted;
                        await db.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    msg = ex.Message;
                    isSuccess = false;
                }
            }

            result.success = isSuccess;
            result.msg = msg;
            return Ok(result);
        }
    }
}