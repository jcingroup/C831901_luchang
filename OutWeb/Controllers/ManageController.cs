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
