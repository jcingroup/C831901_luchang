using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OutWeb.Models.NewsModels
{
    public class ListDataModel : DataModel
    {
        public int BUD_USR_ID { get; set; }
        public int UPD_USR_ID { get; set; }

        public string UPD_DT_STR { get; set; }
        public string BUD_DT_STR { get; set; }
    }
}