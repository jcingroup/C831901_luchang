using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace OutWeb.Repositories
{
    public static class UnityStaticProcess
    {
        /// <summary>
        /// 取得WebConfig的AppSetting
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetConfigAppSetting(string key)
        {
            return ConfigurationManager.AppSettings[key];
        }

    }
}