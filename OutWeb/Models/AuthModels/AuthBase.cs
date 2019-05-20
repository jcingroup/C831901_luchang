using OutWeb.Models.AuthModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OutWeb.Models.AuthModels
{
    public class AuthBase : IAuth
    {
        public string id { get; set; }
        public string pwd { get; set; }
        public string guid { get; set; }
        public long initialTime { get; set; }
    }
}