using JWT;
using JWT.Algorithms;
using JWT.Builder;
using JWT.Serializers;
using Newtonsoft.Json.Linq;
using OutWeb.Models.api;
using OutWeb.Models.AuthModels;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace OutWeb.Controllers.api
{
    [RoutePrefix("siteauth")]
    public class TokenController : ApiController
    {
        [HttpPost]
        [Route("gettoken")]
        public async Task<IHttpActionResult> GetToken(AuthBase loginData)
        {
            JsonResultBase result = new JsonResultBase();
            try
            {
                var task = await Task.Run(() => CreateToken(loginData));
                result.Data = task;
            }
            catch (Exception ex)
            {
                result.success = false;
                result.msg = ex.Message;
            }

            return Ok(result);
        }

        public Task<string> CreateToken<T>(T payload) where T : AuthBase
        {
            string guid = Guid.NewGuid().ToString("N");
            payload.guid = guid;
            payload.initialTime = DateTimeOffset.UtcNow.AddHours(8).ToUnixTimeSeconds();

            IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
            IJsonSerializer serializer = new JsonNetSerializer();
            IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
            IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder);

            var token = encoder.Encode(payload, secret);

            return Task.FromResult(token);
        }

        private const string secret = "GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk";


        [HttpPost]
        [Route("validtoken")]
        public void ParsingToken(JObject jobj)
        {
            JsonResultBase result = new JsonResultBase();

            try
            {
                string token = (string)jobj["token"];
                if (string.IsNullOrEmpty(token))
                {
                    throw new Exception("Token驗證失敗");
                }

                //var payloadStr = new JwtBuilder()
                //    .WithSecret(secret)
                //    .MustVerifySignature()
                //    .Decode(token);

                var payloadObj = new JwtBuilder()
                        .WithSecret(secret)
                        .MustVerifySignature()
                        .Decode<AuthBase>(token);

                var now = DateTimeOffset.UtcNow.AddHours(8);
                var initialTime = DateTimeOffset.FromUnixTimeSeconds(payloadObj.initialTime);

                var diffSec = (now - initialTime).TotalSeconds;
                if (diffSec > 3600)
                {
                    throw new Exception("Token驗證失敗");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}