using OutWeb.Models.AuthModels;

namespace OutWeb.Models
{
    public class FromLoginModel : AuthBase
    {

        public string CaptchaId { get; set; }
        public string UserEnteredCaptchaCode { get; set; }
    }
}