using JWT.Builder;
using LUCHANGEntities.DATA;
using OutWeb.Models.api;
using OutWeb.Models.AuthModels;
using OutWeb.Repositories;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace OutWeb.Attritube
{
    public class JwtAuthActionFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            string secret = UnityStaticProcess.GetConfigAppSetting("JwtSecret");

            if (actionContext.Request.Headers.Authorization == null || actionContext.Request.Headers.Authorization.Scheme != "Bearer")
            {
                SetErrorResponse(actionContext, "驗證錯誤");
            }
            else
            {
                try
                {
                    string token = (actionContext.Request.Headers.Any(x => x.Key == "Authorization")) ? actionContext.Request.Headers.Where(x => x.Key == "Authorization").FirstOrDefault().Value.SingleOrDefault().Replace("Bearer ", "") : "";
                    if (string.IsNullOrEmpty(token))
                    {
                        throw new Exception("Token無法取得");
                    }

                    var payloadObj = new JwtBuilder()
                            .WithSecret(secret)
                            .MustVerifySignature()
                            .Decode<AuthBase>(token);

                    if (payloadObj == null)
                        throw new Exception("驗證失敗");

                    using (var db = new LUCHANGDB())
                    {
                        var source = db.USER.Where(s => s.USR_NM == payloadObj.id)
                            .FirstOrDefault();

                        if (source == null || source.DISABLE)
                            throw new Exception("無法驗證使用者，是否已停用或被刪除?");
                    }

                    var now = DateTimeOffset.UtcNow.AddHours(8);
                    var initialTime = DateTimeOffset.FromUnixTimeSeconds(payloadObj.initialTime);

                    var diffSec = (now - initialTime).TotalSeconds;
                    if (diffSec > 3600)
                    {
                        throw new Exception("Token時效性已過，請重新登入取得Token");
                    }
                }
                catch (Exception ex)
                {
                    SetErrorResponse(actionContext, ex.Message);
                }
            }

            base.OnActionExecuting(actionContext);
        }

        private static void SetErrorResponse(HttpActionContext actionContext, string message)
        {
            var response = actionContext.Request.CreateResponse(HttpStatusCode.Unauthorized, new JsonResultBase()
            {
                success = false,
                msg = message,
                url = "/_SysAdm"
            });
            actionContext.Response = response;
        }
    }
}