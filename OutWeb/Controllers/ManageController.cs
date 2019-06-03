using BotDetect.Web;
using LUCHANGEntities.DATA;
using OutWeb.Models;
using OutWeb.Models.api;
using OutWeb.Models.AuthModels;
using OutWeb.Models.NewsModels;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace OutWeb.Controllers
{
    [Authorize]
    [RoutePrefix("_SysAdm")]
    [Route("{action=Login}")]
    [Route("{action}/{id}")]
    public class ManageController : Controller
    {
        public ManageController()
        {
            ViewBag.IsFirstPage = false;
        }

        // GET: _SysAdm
        public ActionResult Index()
        {
            return View();
        }

        // GET: _SysAdm/login
        [HttpGet]
        [AllowAnonymous]
        public ActionResult Login()
        {
            ViewBag.IsFirstPage = true;
            return View();
        }

        private JsonResult BadResult(string msg)
        {
            return Json(new JsonResultBase() { success = false, msg = msg, url = string.Empty });
        }

        [HttpPost]
        [AllowAnonymous]
        public JsonResult Login(FromLoginModel data)
        {
            JsonResultBase result = new JsonResultBase();

            string msg = string.Empty;
            bool isSuccess = true;
            string userEnteredCaptchaCode = data.UserEnteredCaptchaCode;
            string captchaId = data.CaptchaId;
            string url = string.Empty;
            SimpleCaptcha captcha = new SimpleCaptcha();
            isSuccess = captcha.Validate(userEnteredCaptchaCode, captchaId);

            if (!ModelState.IsValid)
            {
                return BadResult("請確認登入資訊以確實填入");
            }

            if (!isSuccess)
            {
                return BadResult("驗證碼輸入錯誤");
            }

            int userId = 0;
            using (var db0 = new LUCHANGDB())
            {
                var user = db0.USER.Where(x => x.USR_ID == data.id && x.USR_PWD == data.pwd).FirstOrDefault();
                if (user == null)
                    return BadResult("帳號或密碼錯誤");
                userId = user.ID;
            }

            #region 後台登錄

            string user_data = "Admin";

            //有效期限 三天
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, data.id, DateTime.Now, DateTime.Now.AddDays(3),
                                                                 false, user_data, FormsAuthentication.FormsCookiePath);
            string encTicket = FormsAuthentication.Encrypt(ticket);
            Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));

            //寫入所需的Cookie資訊
            var cookie_loginid = new HttpCookie(WebSetup.Cookie_LoginId, userId.ToString());
            cookie_loginid.HttpOnly = true;
            Response.Cookies.Add(cookie_loginid);

            #endregion 後台登錄

            url = Url.Content("~/_SysAdm/List/1");

            return Json(new JsonResultBase() { success = isSuccess, msg = msg, url = url });
        }

        public RedirectResult Logout()
        {
            RemoveCookie(WebSetup.Cookie_LoginId);
            FormsAuthentication.SignOut();

            return Redirect("~/_SysAdm/Login");
        }

        private void RemoveCookie(string key)
        {
            var c = new HttpCookie(key);
            c.Values.Clear();
            c.Expires = DateTime.Now.AddDays(-1);
            Response.Cookies.Set(c);
        }

        public ActionResult List()
        {
            return View();
        }
        public ActionResult Add()
        {
            return View("Edit");
        }
        public ActionResult Edit(int? id)
        {
            return View();
        }

        public async Task<JsonResult> Save(DataModel data)
        {
            bool isInsert = true;
            bool isSuccess = true;
            string msg = string.Empty;
            string url = string.Empty;

            if (!ModelState.IsValid)
                return BadResult("請填入必要資訊【標題】及【作者】");

            if (Request.Cookies[WebSetup.Cookie_LoginId].Value == null)
                return BadResult("無法取得登入者資訊。請重新登入");

            var loginUserId = Convert.ToInt32(Request.Cookies[WebSetup.Cookie_LoginId].Value);

            using (var db = new LUCHANGDB())
            {
                NEWS entity = null;
                if (data.ID.HasValue)
                {
                    isInsert = false;
                    entity = await db.NEWS.Where(s => s.ID == data.ID.Value)
                        .FirstOrDefaultAsync();
                    if (entity == null)
                        return BadResult("無法取得ID為" + data.ID.Value + "資料");
                }
                else
                {
                    isInsert = true;
                    entity = new NEWS()
                    {
                        BUD_DT = DateTime.UtcNow.AddHours(8),
                        BUD_USR_ID = loginUserId,
                    };
                }

                try
                {
                    entity.AUTHOR = data.AUTHOR;
                    entity.CONTENT = data.CONTENT;
                    entity.DISABLED = data.DISABLED;
                    entity.STATUS = data.STATUS;
                    entity.SORT = data.SORT;
                    entity.TITLE = data.TITLE;
                    entity.UPD_DT = DateTime.UtcNow.AddHours(8);
                    entity.UPD_USR_ID = loginUserId;

                    if (isInsert)
                    {
                        db.NEWS.Add(entity);
                    }
                    else
                    {
                        db.Entry(entity).State = EntityState.Modified;
                    }
                    await db.SaveChangesAsync();
                    url = Url.Content("~/_SysAdm/List/1");
                }
                catch (Exception ex)
                {
                    isSuccess = false;
                    msg = ex.Message;
                }
            }

            return Json(new JsonResultBase() { success = isSuccess, msg = msg, url = url });
        }

        // GET: _SysAdm/ChangePW
        public ActionResult ChangePW()
        {
            return View();
        }

        public ActionResult News()
        {
            return View();
        }
    }
}