using System.ComponentModel.DataAnnotations;

namespace OutWeb.Models.NewsModels
{
    public class DataModel
    {
        public int? ID { get; set; }

        [Required]
        public string AUTHOR { get; set; }

        [Required]
        public string TITLE { get; set; }

        public string CONTENT { get; set; }
        public float SORT { get; set; }
        public bool DISABLED { get; set; }
        public bool STATUS { get; set; }
    }
}