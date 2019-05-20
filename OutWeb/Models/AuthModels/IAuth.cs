using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OutWeb.Models.AuthModels
{
    public interface IAuth
    {
         string id { get; set; }
         string pwd { get; set; }
         string guid { get; set; }
        long initialTime { get; set; }
    }
}