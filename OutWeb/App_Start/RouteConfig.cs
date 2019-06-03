﻿using System.Web.Mvc;
using System.Web.Routing;

namespace OutWeb
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            // BotDetect requests must not be routed 
            routes.IgnoreRoute("{*botdetect}",
            new { botdetect = @"(.*)simple-captcha-endpoint\.ashx" });
            routes.MapMvcAttributeRoutes();
            
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
