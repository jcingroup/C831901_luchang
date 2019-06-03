using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Web.Mvc;
using System.Web.Routing;

namespace OutWeb.Attritube
{
    public class JwtAuthActionFilter : AuthorizeAttribute
    {
        public string ControllerID { get; internal set; }

        public string ActionID { get; internal set; }

        /// <summary>
        /// JsonSerializer 讀取屬性的解析器設定
        /// </summary>
        private class ReadablePropertiesOnlyResolver : DefaultContractResolver
        {
            /// <summary>
            /// 建立可呈現（解析）的屬性
            /// </summary>
            /// <returns>呈現的屬性</returns>
            protected override JsonProperty CreateProperty(MemberInfo member, MemberSerialization memberSerialization)
            {
                JsonProperty property = base.CreateProperty(member, memberSerialization);
                if (typeof(Stream).IsAssignableFrom(property.PropertyType))
                {
                    property.Ignored = true;
                }
                return property;
            }
        }

        private void CheckPermission(AuthorizationContext filterContext)
        {
            var headers = filterContext.RequestContext.HttpContext.Request.Headers
                                .AllKeys
                                .Select(s => s == "Authorization")
                                .FirstOrDefault();

            var parameters = filterContext.ActionDescriptor.GetParameters();

            //if (SignInProvider.Instance.User == null)
            //{
            if (filterContext.HttpContext.Request.IsAjaxRequest())
            {
                var urlHelper = new UrlHelper(filterContext.RequestContext);
                filterContext.HttpContext.Response.StatusCode = 403;

                //以下為自訂訊息 但ajax始終無法取出 保留待日後有機會再探討
                //JsonResult unauthorizedResult = new JsonResult
                //{
                //    ContentEncoding = Encoding.UTF8,
                //    MaxJsonLength = 10000000,
                //    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                //    Data = new
                //    {
                //        request = "NotAuthorized",
                //        logOnUrl = urlHelper.Action("Logon", "Account"),
                //    }
                //};
                //filterContext.Result = unauthorizedResult;
                //    filterContext.HttpContext.Response.End();
                //}
                //else
                //{
                filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                {
                    action = "Logon",
                    controller = "Account"
                }));
                //}
            }
            else
            {
                filterContext.Result = new HttpUnauthorizedResult();
            }
        }

        /// <summary>
        /// 實作權限存取規則
        /// </summary>
        /// <param name="filterContext"></param>
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            this.ControllerID = filterContext.RouteData.Values["controller"].ToString();
            this.ActionID = filterContext.RouteData.Values["action"].ToString();

            //驗證順序 OnAuthorization -> AuthorizeCore(false) -> HandleUnauthorizedRequest
            //驗證帳號
            base.OnAuthorization(filterContext);

            if (filterContext.Result is HttpUnauthorizedResult)
            {
                CheckPermission(filterContext);
                return;
            }
        }

        private void SetErrorResponse(AuthorizationContext filterContext, string message)
        {
            filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
            {
                action = "Logon",
                controller = "Account",
                message
            }));
        }

        //public override void OnActionExecuting(ActionExecutingContext filterContext)
        //{
        //    base.OnActionExecuting(filterContext);
        //    string secret = UnityStaticProcess.GetConfigAppSetting("JwtSecret");

        //    if (filterContext.RequestContext.HttpContext.Request.Headers.AllKeys.Any(x => x == "Authorization"))
        //    {
        //        SetErrorResponse(actionContext, "驗證錯誤");
        //    }
        //    //// 參數資訊
        //    //string parametersInfo = JsonConvert.SerializeObject(filterContext.ActionParameters, new JsonSerializerSettings()
        //    //{
        //    //    ContractResolver = new ReadablePropertiesOnlyResolver()
        //    //});

        //    //// 運行中的 Controller & Action 資訊
        //    //string controllerName = filterContext.Controller.GetType().Name;
        //    //string actionName = filterContext.ActionDescriptor.ActionName;

        //    //// 訊息內容
        //    //string message = string.Format(
        //    //    "{0}.{1}() => {2}",
        //    //    controllerName,
        //    //    actionName,
        //    //    string.IsNullOrEmpty(parametersInfo) ? "(void)" : parametersInfo
        //    //);

        //    //// 寫入訊息
        //    //Logger logger = LogManager.GetCurrentClassLogger();
        //    //logger.Info(message);
        //}
    }
}