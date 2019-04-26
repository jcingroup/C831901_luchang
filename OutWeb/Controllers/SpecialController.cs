using System.Web.Mvc;

namespace OutWeb.Controllers
{
    public class SpecialController : Controller
    {
        public SpecialController()
        {
            ViewBag.IsFirstPage = false;
        }
        // GET: Special
        public ActionResult Index()
        {
            return View("List");
        }
        public ActionResult List()
        {
            return View();
        }
        // GET: Special/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }
    }
}