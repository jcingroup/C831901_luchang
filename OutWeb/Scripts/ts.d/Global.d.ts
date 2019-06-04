//本文件值需由Server傳送給RLayout.html 或 Main.cshtml
declare var gb_approot: string;
declare var gb_caption: string //目前執行的系統標題
declare var gb_menuname: string //目前執行的系統選單名稱
declare var gb_menu_id: number;
declare var gb_applink: string;
declare var lang: LangStruct; //系統語系檔
declare var paramjs: Array<DotWeb.WebApp.Models.JsonWebParam.WebParam>; //前台變動式參數值
declare var CKEDITOR: any;