/**
 * call ajax 包裝共同參數 
 * @param obj
 */

export const WarpCommParm = (obj?: any) => {
    //製作回傳WebApi
    let r = {
        device: 'W',
        account: account,
        csrf_token: gb_csrf_token
    };

    let m = null;

    if (obj != undefined && obj != null) {
        m = extend({}, r, obj);
    } else {
        m = r;
    }

    return m;
}

function extend(...target: any[]) {
    let sources = [].slice.call(arguments, 1);
    let newobj = {};
    sources.forEach(function (source) {
        for (var prop in source) {
            //target[prop] = source[prop];
            newobj[prop] = source[prop]
        }
    });
    //return target;
    return newobj
}