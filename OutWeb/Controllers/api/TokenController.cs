using BotDetect.Web;
using JWT;
using JWT.Algorithms;
using JWT.Serializers;
using LUCHANGEntities.DATA;
using OutWeb.Models;
using OutWeb.Models.api;
using OutWeb.Models.AuthModels;
using OutWeb.Repositories;
using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;

namespace OutWeb.Controllers.api
{
    [RoutePrefix("siteauth")]
    public class TokenController : ApiController
    {
        [HttpPost]
        [Route("login")]
        public async Task<IHttpActionResult> Login([FromBody]FromLoginModel data)
        {
            bool isSuccess = true;
            string msg = string.Empty;
            string url = string.Empty;
            TokenResult result = new TokenResult();
            try
            {
                string userEnteredCaptchaCode = data.UserEnteredCaptchaCode;
                string captchaId = data.CaptchaId;

                SimpleCaptcha captcha = new SimpleCaptcha();
                isSuccess = captcha.Validate(userEnteredCaptchaCode, captchaId);

                if (!isSuccess)
                    throw new Exception("驗證碼輸入錯誤!");

                try
                {
                    var task = await Task.Run(() => CreateToken(data));
                    result.token = task;
                    result.url = "/_SysAdm/List/1";
                }
                catch (Exception ex)
                {
                    result.success = false;
                    result.msg = ex.Message;
                }
            }
            catch (Exception ex)
            {
                msg = ex.Message;
            }
            return Ok(result);
        }

        [HttpPost]
        [Route("gettoken")]
        public async Task<IHttpActionResult> GetToken(AuthBase loginData)
        {
            JsonResultBase result = new JsonResultBase();
            try
            {
                var task = await Task.Run(() => CreateToken(loginData));
                result.data = task;
            }
            catch (Exception ex)
            {
                result.success = false;
                result.msg = ex.Message;
            }

            return Ok(result);
        }

        public async Task<string> CreateToken<T>(T payload) where T : IAuth
        {
            string secret = UnityStaticProcess.GetConfigAppSetting("JwtSecret");
            string guid = Guid.NewGuid().ToString("N");

            if (string.IsNullOrEmpty(payload.id) || string.IsNullOrEmpty(payload.pwd))
                throw new Exception("使用者帳號或密碼為空值。");

            using (var db = new LUCHANGDB())
            {
                var source = await db.USER.Where(s => s.USR_NM == payload.id)
                    .FirstOrDefaultAsync();

                if (source == null)
                    throw new Exception("無法取得使用者。");
            }

            payload.GetType().GetProperty("guid").SetValue(payload, guid);
            payload.GetType().GetProperty("initialTime").SetValue(payload, DateTimeOffset.UtcNow.AddHours(8).ToUnixTimeSeconds());
            IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
            IJsonSerializer serializer = new JsonNetSerializer();
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
            IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder);

            var token = encoder.Encode(payload, secret);

            return token;
        }
    }
}