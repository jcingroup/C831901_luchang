using OutWeb.Models.AuthModels;
using System.ComponentModel.DataAnnotations;

namespace OutWeb.Models.AuthModels
{
    public class FromLoginModel : AuthBase
    {
        [Required]
        public string CaptchaId { get; set; }
        [Required]
        public string UserEnteredCaptchaCode { get; set; }
    }
}