﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OutWeb.Models.api
{
    public class JsonResultBase
    {
        public bool success { get; set; } = true;
        public string msg { get; set; }

        public object Data { get; set; }
    }
}