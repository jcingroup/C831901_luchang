using OutWeb.Attritube;
using System.Threading.Tasks;
using System.Web.Http;

namespace OutWeb.Controllers.api
{
    [JwtAuthActionFilter]
    [RoutePrefix("api/manage")]
    public class ManageController : ApiController
    {

        [HttpGet]
        [Route("getlist")]
        public async Task<IHttpActionResult> GetList(int id)
        {
            return Ok();
        }

        [HttpGet]
        [Route("getdata")]
        public async Task<IHttpActionResult> GetDataByID(int id)
        {
            return Ok();
        }

        [HttpPost]
        [Route("getdata")]
        public async Task<IHttpActionResult> SaveData()
        {
            return Ok();
        }

        [HttpPost]
        [Route("removedata")]
        public async Task<IHttpActionResult> RemoveDataByID()
        {
            return Ok();
        }
    }
}