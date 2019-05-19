namespace OutWeb.Models
{
    public class LoginModel
    {
        public string id { get; set; }
        public string pwd { get; set; }

        public string CaptchaId { get; set; }
        public string UserEnteredCaptchaCode { get; set; }
    }
}