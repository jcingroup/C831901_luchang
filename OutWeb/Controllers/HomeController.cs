using System.Web.Mvc;

namespace OutWeb.Controllers
{
    
    public class HomeController : Controller
    {
        public HomeController()
        {
            ViewBag.IsFirstPage = false;
        }

        public ActionResult Index()
        {
            ViewBag.IsFirstPage = true; //是否為首頁，請在首頁的Action此值設為True
            return View();
        }

        [Route("Team")]
        public ActionResult Team()
        {
            return View();
        }

        [Route("Profession")]
        public ActionResult Profession()
        {
            return View();
        }

        [Route("ContactUs")]
        public ActionResult ContactUs()
        {
            return View();
        }
    }
}