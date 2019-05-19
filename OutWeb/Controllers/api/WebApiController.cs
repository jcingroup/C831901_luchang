using BotDetect.Web;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace OutWeb.Controllers.api
{
    public class WebApiController : ApiController
    {
        public class ValidModel
        {
            public string UserEnteredCaptchaCode { get; set; }
            public string CaptchaId { get; set; }
        }

        public HttpResponseMessage Post([FromBody]ValidModel value)
        {
            string userEnteredCaptchaCode = value.UserEnteredCaptchaCode;
            string captchaId = value.CaptchaId;

            // create a captcha instance to be used for the captcha validation 
            SimpleCaptcha yourFirstCaptcha = new SimpleCaptcha();
            // execute the captcha validation 
            bool isHuman = yourFirstCaptcha.Validate(userEnteredCaptchaCode, captchaId);
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StringContent("{\"success\":false}", Encoding.UTF8, "application/json");
            if (isHuman == false)
            {
                // captcha validation failed; notify the frontend  
                // TODO: consider logging the attempt 
                //HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK);
                //response.Content = new StringContent("{\"success\":false}", Encoding.UTF8, "application/json");
                return response;
            }
            else
            {
                // TODO: captcha validation succeeded; execute the protected action 
                // TODO: do not forget to notify the frontend about the results 
            }
            return response;
        }

        // GET: api/WebApi
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/WebApi/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/WebApi
        //public void Post([FromBody]string value)
        //{
        //}

        // PUT: api/WebApi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/WebApi/5
        public void Delete(int id)
        {
        }
    }
}