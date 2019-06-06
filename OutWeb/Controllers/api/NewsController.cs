using LinqKit;
using LUCHANGEntities.DATA;
using OutWeb.Models;
using OutWeb.Models.api;
using OutWeb.Models.NewsModels;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace OutWeb.Controllers.api
{
    [Authorize]
    [RoutePrefix("api/News")]
    public class NewsController : ApiController
    {
        private int GetUserID()
        {
            var id = HttpContext.Current.Request.Cookies[WebSetup.Cookie_LoginId].Value;
            if (string.IsNullOrEmpty(id))
                throw new Exception("無法取得使用者登入資訊");
            return Convert.ToInt32(id);
        }

        [Route("List")]
        public async Task<IHttpActionResult> GetList()
        {
            JsonResultBase result = new JsonResultBase();

            //LinqLik 預留
            var predicate = PredicateBuilder.New<NEWS>();

            //if (q.keyword != null)
            //    predicate = predicate.And(x => x.name.Contains(q.keyword) || x.zip.Contains(q.keyword) || x.city.Contains(q.keyword)
            //                || x.country.Contains(q.keyword) || x.address.Contains(q.keyword));
            bool isSuccess = true;
            string msg = string.Empty;
            object resultData = null; ;
            using (var db = new LUCHANGDB())
            {
                try
                {
                    //var item_where = db.NEWS.AsExpandable().Where(predicate);
                    var data = await db.NEWS
                   .AsExpandable()
                   .ToListAsync();

                    resultData = data.Select(s => new ListDataModel()
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
                    });
                }
                catch (Exception ex)
                {
                    isSuccess = false;
                    msg = ex.Message;
                }
            }

            result.data = resultData;
            result.success = isSuccess;
            result.msg = msg;
            return Ok(result);
        }

        // GET: api/News
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
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

        // PUT: api/News/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/News/5
        public void Delete(int id)
        {
        }
    }
}