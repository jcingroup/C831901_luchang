import $ = require('jquery');
import toastr = require('toastr');
import Moment = require('moment');
import { Function } from '@babel/types';


export function guid() {
    /**
     * 產生GUID
     */
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
function obj_prop_list(obj) {
    /*
    Autohr:Jerry
    Date:2014/2/23
    Description:列出物件屬性
    */
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            console.log(prop + " :" + obj[prop]);
        }
    }
}
export function isValidJSONDate(value: string, userFormat) {
    var userFormat = userFormat || 'yyyy-mm-dd';

    var delimiter = /[^mdy]/.exec(userFormat)[0];
    var theFormat = userFormat.split(delimiter);

    var splitDatePart = value.split('T');
    if (splitDatePart.length == 1)
        return false;

    var theDate = splitDatePart[0].split(delimiter);
    var isDate = function (date, format) {
        var m, d, y;
        for (var i = 0, len = format.length; i < len; i++) {
            if (/m/.test(format[i])) m = date[i];
            if (/d/.test(format[i])) d = date[i];
            if (/y/.test(format[i])) y = date[i];
        };
        return (
            m > 0 && m < 13 &&
            y && y.length === 4 &&
            d > 0 && d <= (new Date(y, m, 0)).getDate()
        )
    }

    return isDate(theDate, theFormat)
}
/**
 * 標準時間格式
 * @param utcstr
 */
export function stdTime(utcstr: any) {
    if (utcstr && isValidJSONDate(utcstr, null)) {
        return Moment(utcstr).format("HH:mm")
    } else
        return null;
}
/**
 * 系統標準日期
 * @param utcstr UTC日期格
 */
export function stdDate(utcstr: any) {

    if (utcstr && isValidJSONDate(utcstr, null)) {
        return Moment(utcstr).format("YYYY-MM-DD")
    } else
        return null;
}
/**
 * 加千分位數字及小數點位數
 * @param num 數字來源
 * @param float_num 小數點顯示位數
 */
export function stdNumber(num: number, float_num: number) {
    if (num == undefined || num == null)
        return '';

    return fmtMoney(floatSpot(num, float_num));
}

export function stdNumberFloat(num: number, float_num: number) {
    // 1 => 1.00 2.3=>2.30

    if (num == undefined || num == null)
        return '';

    var n = floatSpot(num, float_num);
    var s = n.toFixed(float_num);
    return s;
}

export function fmtMoney(n: number, g?: string): string {
    /*
    Autohr:Ajoe
    Date:2015/12/09
    Description:金錢格式
    */

    if (n == undefined || n == null)
        return '';

    let glue = (typeof g == 'string' && g != null && g != undefined) ? g : ',';// 決定三個位數的分隔符號
    let digits = n.toString().split('.');// 先分左邊及小數點後

    let pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(digits[0])) {//判斷有沒有符合 前面為三個數字
        digits[0] = digits[0].replace(pattern, "$1" + glue + "$2");
    }
    return digits.join(".");
}

export function getOptByVal(options: SelectTextOptions[], value: string | number) {
    var items = options.filter(x => x.value === value)
    if (items.length > 0)
        return items[0];
    else
        return null;
}

function getNowDate(): Date {
    var d: Date = new Date();
    var r: Date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
    return r;
}
function monthFirstDay() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth(), 1);
    return r;
}
function monthLastDay() {
    var d = new Date();
    var r = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return r;
}
export function tim() {
    var d = new Date(); return d.toUTCString() + '.' + d.getMilliseconds().toString();
}
//補字元
export function pad(str: string, len: number, pad: string, dir: number) {

    var padlen: number;
    if (typeof (len) == "undefined") { var len = 0; }
    if (typeof (pad) == "undefined") { var pad = ' '; }
    if (typeof (dir) == "undefined") { var dir = 3; }

    if (len + 1 >= str.length) {

        switch (dir) {

            case 1:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;

            case 2:
                str = str + Array(len + 1 - str.length).join(pad);
                break;

            case 3:
                var right = Math.ceil((padlen = len - str.length) / 2);
                var left = padlen - right;
                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                break;
        }
    }
    return str;
}

export function tosMessage(title: string, message: string, type: any) {
    toastr.options.closeButton = true;
    if (type == 0)
        toastr.info(message, title);

    if (type == 1)
        toastr.success(message, title);

    if (type == 2)
        toastr.error(message, title);

    if (type == 3)
        toastr.warning(message, title);
}
export function formatFileSize(byte_size: number): string {
    var get_size = byte_size;

    if (get_size <= 1024) {
        return get_size + 'Byte';
    } else if (get_size > 1024 && get_size <= 1024 * 1024) {
        var num = get_size / 1024;
        var fmt = Math.ceil(num);
        return fmt + 'KB';
    } else {
        var num = get_size / (1024 * 1024);
        var fmt = Math.ceil(num);
        return fmt + 'MB';
    }
}
export function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

/**
 * 浮點數取小數點位數
 * @param num 數字來源
 * @param pos 小數點顯示位數
 */
export function floatSpot(num, pos) {
    let size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}
//除數加浮點數取小數點位數 格式化
export function divisor(num, div_num, pos) {
    if (num !== null && num != undefined) {
        if (pos != null)
            return floatSpot(num / div_num, pos);
        else
            return num / div_num;
    } else
        return null;

}
export function ifrmDown(download_src) {
    //background download excel file
    $('#file_down').remove();
    var item = $(this).attr('item');
    var src = src;
    var encSrc = download_src;
    var ifram = $('<iframe id="file_down" style="display:none">');
    ifram.attr('src', encSrc);
    $(document.body).append(ifram);
}

export function isNumeric(n): boolean {
    let m = parseFloat(n);
    //return !isNaN(parseFloat(n)) && isFinite(n) && m >= 0; //正能正整數
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function getBrower() {
    var Sys: any = {};
    var ua = navigator.userAgent.toLowerCase();
    var s: any;
    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

    if (Sys.ie) return ('IE: ' + Sys.ie);
    if (Sys.firefox) return ('Firefox: ' + Sys.firefox);
    if (Sys.chrome) return ('Chrome: ' + Sys.chrome);
    if (Sys.opera) return ('Opera: ' + Sys.opera);
    if (Sys.safari) return ('Safari: ' + Sys.safari);
}
function checkTwID(id) {
    /*
      Autohr:Ajoe
      Date:2015/9/8
      Description:台灣身份證檢查簡
    */
    if (id != null && id != "") {
        //建立字母分數陣列(A~Z)
        var city = new Array(
            1, 10, 19, 28, 37, 46, 55, 64, 39, 73, 82, 2, 11,
            20, 48, 29, 38, 47, 56, 65, 74, 83, 21, 3, 12, 30
        )
        id = id.toUpperCase();
        // 使用「正規表達式」檢驗格式
        if (id.search(/^[A-Z](1|2)\d{8}$/i) == -1) {
            //alert('基本格式錯誤');
            return false;
        } else {
            //將字串分割為陣列(IE必需這麼做才不會出錯)
            id = id.split('');
            //計算總分
            var total = city[id[0].charCodeAt(0) - 65];
            for (var i = 1; i <= 8; i++) {
                total += eval(id[i]) * (9 - i);
            }
            //補上檢查碼(最後一碼)
            total += eval(id[9]);
            //檢查比對碼(餘數應為0);
            return ((total % 10 == 0));
        }
    } else {
        return true;
    }
}
function DiffDate(start: string, end: string) {
    /*
      Autohr:Ajoe
      Date:2015/9/24
      Description:計算兩日期相差天數
    */
    if (start != null && end != null) {
        var day_s: Date = new Date(start);
        var day_e: Date = new Date(end);
        if (day_s <= day_e) {
            //開始日期 小於等於 結束日期 才計算
            var iDays: number = (Math.abs(day_e.getTime() - day_s.getTime()) / 1000 / 60 / 60 / 24) + 1;
            return { result: 1, diff_day: iDays };
        } else {
            return { result: -1, diff_day: 0 };
        }
    } else {
        return { result: -2, diff_day: 0 };
    }
}

export function MntV(date) {
    //將日期設定成moment物件
    var r = date === null || date === undefined ? null : Moment(date);
    return r;
}
export function formatNumber(number) {
    if (number == undefined || number == null) {
        return '';
    }
    var snumber = number.toFixed(2) + '';
    var x = snumber.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1;
}
//查詢QueryString
export function queryString(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function makeInputValue(e: React.SyntheticEvent<EventTarget>) {
    let input: HTMLInputElement = e.target as HTMLInputElement;
    let value;

    if (input.value == 'true') {
        value = true;
    } else if (input.value == 'false') {
        value = false;
    } else {
        value = input.value;
    }

    return value;
}

export function getTwDate(d: any): string {
    //顯示台灣日期
    if (d == null || d == undefined) {
        return "";
    }
    let date = new Date(d);
    let mm = Moment(d);//改用moment套件

    let year = mm.year(),//date.getFullYear(),
        month = mm.month() + 1,//date.getMonth() + 1, // months are zero indexed
        day = mm.date(),//date.getDate(),
        hour = mm.hours(),//date.getHours(),
        minute = mm.minutes(),//date.getMinutes(),
        second = mm.seconds(),//date.getSeconds(),
        hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        morning = hour < 12 ? "am" : "pm",
        result: string = `${year - 1911}年${month}月${day}日 `;

    return result;
}

export const packegeErrList = (err_list: Array<ErrDescription>): string => {
    let ls = [];
    //console.log('check err list', err_list);
    if (err_list && err_list.length > 0) {
        err_list.forEach((item, i) => {
            item.err.forEach((list, j) => {
                ls.push(item.field + ':' + list.message);
            })
        })
    }
    return ls.join('<br />');
}
//錯誤訊息包裝處
export const showErrList = (title, err_list: Array<ErrDescription>): void => {
    let err_msgs = packegeErrList(err_list);
    tosMessage(title, err_msgs, 3);
}
//製作樣版函式
export function mkTpl(strings, ...keys) {
    return (function (...values) {
        var dict = values[values.length - 1] || {};
        var result = [strings[0]];
        keys.forEach(function (key, i) {
            var value = Number.isInteger(key) ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}

export function isOK(src): boolean {
    if (src === undefined || src === null || src === '')
        return false;
    else
        return true;
}

//字串是否全中文
export function testZH(src) {

    for (var i = 0; i < src.length; i++) {

        if (src.charCodeAt(i) < 0x4E00 || src.charCodeAt(i) > 0x9FA5) {
            return false;
        }
    }
    return true;
}

/**
 * 浮點數相加
 * @param arg1
 * @param arg2
 */
export function foAdd(arg1, arg2) {

    var r1, r2, m;

    try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }

    try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }

    m = Math.pow(10, Math.max(r1, r2));

    return (foMul(arg1, m) + foMul(arg2, m)) / m;

}
/**
 * 浮點數相減
 * @param arg1
 * @param arg2
 */
export function foSubtraction(arg1, arg2) {

    var r1, r2, m, n;

    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }

    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }

    m = Math.pow(10, Math.max(r1, r2));

    n = (r1 >= r2) ? r1 : r2;

    return ((arg1 * m - arg2 * m) / m).toFixed(n);

}
/**
 * 浮點數相乘
 * @param arg1
 * @param arg2
 */
export function foMul(arg1, arg2) {

    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();

    try { m += s1.split(".")[1].length; } catch (e) { }

    try { m += s2.split(".")[1].length; } catch (e) { }

    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);

}
/**
 * 浮點數相除
 * @param arg1
 * @param arg2
 */
export function foDiv(arg1, arg2) {

    var t1 = 0, t2 = 0, r1, r2;

    try { t1 = arg1.toString().split(".")[1].length } catch (e) { }

    try { t2 = arg2.toString().split(".")[1].length } catch (e) { }

    //with (Math) {

    r1 = Number(arg1.toString().replace(".", ""))

    r2 = Number(arg2.toString().replace(".", ""))

    return (r1 / r2) * Math.pow(10, t2 - t1);

    //}

}
/**
 * 取得選單目前選取項目
 * @param data 選單資料
 */
export function getMenuName(data: server.Menu[]) {

    let m1 = data.filter(x => x.Active == true);
    let m2 = m1 && m1.length > 0 ? m1[0].Items.filter(x => x.Active == true) : null;

    let m1_name = m1 && m1.length > 0 ? m1[0].ItemName : null;
    let m2_name = m2 && m2.length > 0 ? m2[0].ItemName : "";
    return { m1: m1_name, m2: m2_name };
}
/**
 * 依語係傳出不同字串
 * @param zhTW  中文
 * @param vnVN  越南
 * @param thTH  泰國
 * @param idID  印尼
 * @param msMS  馬來西亞
 */
export function pickLang(zhTW, vnVN, thTH = null, idID = null, msMS = null) {
    return '';
}
/**
 * 取得系統前端參數值
 * @param key 要取得的參數key
 */
export function pv(key) {
    var r = null;
    //paramjs.forEach((item, i) => {
    //    if (item.key == key) {
    //        r = item.value;
    //    }
    //})
    return r;
}
/**
 * 依據value取得Select資料內的label直
 * @param val 要取得的參數value
 * @param data 要取得的參數selectlist
 */
export function getOptionName(val, data: Array<SelectTextOptions>): string {
    let res = data.filter((x) => { return x.value == val; });
    let name: string = "";
    if (res.length > 0) {
        name = res[0].label;
    }
    return name;
}
/**
 * 顯示台斤格式
 * @param qty 台斤值
 */
export function fnTg(qty: number): string {
    let n: number = 0, f: string = '0', fn: number = 0, res: string = '0';
    if (qty != 0) {
        let digits = qty.toString().split('.');
        n = parseInt(digits[0]); f = digits.length > 1 ? digits[1] : '0';

        fn = f == '1' ? 10 : parseInt(f);

        res = (n != 0 ? `${n}斤` : '') + (f != '0' ? `${fn}兩` : '');
    }

    return res;
};
/**
 * 出貨單openwin
 * @param demand_sn
 */
export const OpenWinFunc = (demand_sn) => {
    let param = [];
    param.push('demand_sn=' + demand_sn);

    let params = param.join('&');

    let url = gb_approot + 'Active/Func/PackingList?' + params;

    let open_p = 'width=960'; {/* screen.width; */ }
    open_p += ', height=600'; {/* screen.height; */ }
    open_p += ', top=0, left=0';
    open_p += ', fullscreen=no';
    open_p += ', resizable=yes';
    open_p += ', toolbar=no,menubar=no,location=no,status=no';

    let win = window.open(url, 'PackingList', open_p);
    win.focus();
}
/** 
 * 2019-06-02 承心
 * 產生鍵盤輸入停頓延遲處理
 * @param timeout 延遲時間
 * @param handle 處理函式
 */
export function MakeKeySwitch(timeout = 1000, handle: (key_context: string) => void) {

    let keySwitch = {
        timerIdKeyRecord: null,
        keyContext: '',
        keyRecord: function (e) {
            this.keyContext += e.key;
            clearTimeout(this.timerIdKeyRecord);
            this.timerIdKeyRecord = setTimeout(function () {
                var getKeyContext = this.keyContext;
                //console.log(getKeyContext);
                handle(getKeyContext);
                this.keyContext = ''
            }.bind(this), timeout)
        },
        /**啟動 */
        start: function () {
            document.addEventListener('keypress', this.keyRecord.bind(this), false);
        }
    };

    var keySwitchObject: typeof keySwitch = Object.create(keySwitch);

    return keySwitchObject;
}