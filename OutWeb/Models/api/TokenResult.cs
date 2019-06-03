using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OutWeb.Models.api
{
    public class TokenResult: JsonResultBase
    {
        public string token { get; set; }
    }
}