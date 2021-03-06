﻿namespace OutWeb.Models.api
{
    public class JsonResultBase
    {
        public bool success { get; set; } = true;
        public string msg { get; set; } = "success";

        public object data { get; set; }

        public string url { get; set; }
    }
}