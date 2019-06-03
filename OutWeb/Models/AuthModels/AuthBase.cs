using OutWeb.Models.AuthModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace OutWeb.Models.AuthModels
{
    public class AuthBase : IAuth
    {
        [Required]
        public string id { get; set; }
        [Required]
        public string pwd { get; set; }
        public string guid { get; set; }
        public long initialTime { get; set; }
    }
}