//本文件值需由Server傳送給RLayout.html 或 Main.cshtml
declare var gb_approot: string;
declare var gb_caption: string //目前執行的系統標題
declare var gb_menuname: string //目前執行的系統選單名稱
declare var gb_menu_id: string;
declare var gb_Lang: LangStruct; //全域系統語系檔
declare var gb_culture: string;
declare var gb_csrf_token: string;
//declare var paramjs: Array<DotWeb.WebApp.Models.JsonWebParam.WebParam>; //前台變動式參數值
declare var account: string;
declare var role: string;
declare var workYear: number;

//google reCAPTCHA
declare var grecaptcha: any;
declare var widgetId: any;
//塔配 DotWeb.Controller.cs MakeWWWCommJSVar()修正