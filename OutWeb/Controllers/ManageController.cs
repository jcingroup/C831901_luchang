using OutWeb.Attritube;
using OutWeb.Models;
using OutWeb.Models.api;
using OutWeb.Models.AuthModels;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace OutWeb.Controllers
{
    //[JwtAuthActionFilter]
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
        public ActionResult Login()
        {
            ViewBag.IsFirstPage = true;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public JsonResult Login(FromLoginModel data)
        {
            JsonResultBase result = new JsonResultBase();

            #region 後台登錄

            //string user_data = get_user.LoginType; //記錄登錄權限類型   user_data 這裡的字串是可以自訂的 在Global.asax 取出再做處理 一般這會放角色設定
            //有效期限 三天
            FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, data.id, DateTime.Now, DateTime.Now.AddDays(3),
                                                                 false, "Admin", FormsAuthentication.FormsCookiePath);
            string encTicket = FormsAuthentication.Encrypt(ticket);
            Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, encTicket));

            //DateTime last_login_time = get_user.last_login ?? DateTime.Now;
            //get_user.last_login = DateTime.Now;
            //await db0.SaveChangesAsync();

            //寫入所需的Cookie資訊
            var cookie_loginid = new HttpCookie(WebSetup.Cookie_LoginId, data.id.Trim());
            cookie_loginid.HttpOnly = true;
            Response.Cookies.Add(cookie_loginid);

            //var cookie_login_type = new HttpCookie(WebSetup.Cookie_RoleId, get_user.LoginType);
            //cookie_login_type.HttpOnly = true;
            //Response.Cookies.Add(cookie_login_type);

            //var cookie_login_name = new HttpCookie(WebSetup.Cookie_UserName, Server.UrlPathEncode(data.name));
            //cookie_login_name.HttpOnly = true;
            //Response.Cookies.Add(cookie_login_name);

            #endregion 後台登錄
            result.url = Url.Content("~/_SysAdm/News");

            return Json(result);
        }

        // GET: _SysAdm/List/5
        public ActionResult List(int id=0)
        {
            return View();
        }

        // GET: _SysAdm/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: _SysAdm/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: _SysAdm/ChangePW
        public ActionResult ChangePW()
        {
            return View();
        }

        [Authorize]
        public ActionResult News()
        {
            ViewBag.IsFirstPage = false;
            return View();
        }
    }
}