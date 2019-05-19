using BotDetect.Web;
using OutWeb.Models;
using System;
using System.Web.Mvc;

namespace OutWeb.Controllers
{
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
        public ActionResult Login()
        {
            ViewBag.IsFirstPage = true;
            return View();
        }

        [HttpPost]
        public JsonResult Login(LoginModel body)
        {
            bool isSuccess = true;
            string msg = string.Empty;
            string url = string.Empty;

            try
            {
                string userEnteredCaptchaCode = body.UserEnteredCaptchaCode;
                string captchaId = body.CaptchaId;

                SimpleCaptcha captcha = new SimpleCaptcha();
                isSuccess = captcha.Validate(userEnteredCaptchaCode, captchaId);

                if (!isSuccess)
                    throw new Exception("驗證碼輸入錯誤!");
            }
            catch (Exception ex)
            {
                msg = ex.Message;
            }

            return Json(new
            {
                success = isSuccess,
                msg = msg,
                url = url
            });
        }

        // GET: _SysAdm/List/5
        public ActionResult List(int id)
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
    }
}