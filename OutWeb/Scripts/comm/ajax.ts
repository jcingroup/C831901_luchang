import * as Pom from 'es6-promise';
Pom.polyfill();
import 'whatwg-fetch';
import { Promise } from 'es6-promise';
import { func } from 'prop-types';

//declare var fetch: any;

function EncodeQueryData(data) {

    var ret = [];
    for (var d in data) {
        if (data[d] !== undefined && data[d] !== null && data[d] !== '')
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        else
            ret.push(encodeURIComponent(d) + "=");
    }
    return ret.join("&");
}


function WarpFetch<T>(...args: any): Promise<T> {
    return fetch.apply(window, args);
}


export function fetchGet<T>(url: string, data: any) {

    const url_param = EncodeQueryData(data);
    let requestHeaders: any = {
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
    };

    if (gb_csrf_token) {
        requestHeaders['csrf_token'] = gb_csrf_token;
    }

    return fetch(url + (url_param == '' ? '' : '?' + url_param), {
        method: 'GET',
        credentials: 'same-origin',
        headers: requestHeaders
    }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
            return response.json();
        }
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    })
        .catch((reason) => {
            console.log(reason, url, data);
            alert('Call WebApi發生錯誤!');
            return reason;
        });
};
export function fetchPost<T>(url: string, data: any) {

    let requestHeaders: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
    };

    if (gb_csrf_token) {
        requestHeaders['csrf_token'] = gb_csrf_token;
    }

    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: requestHeaders,
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
        return reason;
    });
};
export function fetchPut<T>(url: string, data: any) {
    let requestHeaders: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
    };

    if (gb_csrf_token) {
        requestHeaders['csrf_token'] = gb_csrf_token;
    }

    return fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: requestHeaders,
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    })
        .catch((reason) => {
            alert('Call WebApi發生錯誤!');
            return reason;
        });
};
export function fetchDelete<T>(url: string, data: any) {
    let requestHeaders: any = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'pragma': 'no-cache',
        'cache-control': 'no-cache'
    };

    if (gb_csrf_token) {
        requestHeaders['csrf_token'] = gb_csrf_token;
    }

    return fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: requestHeaders,
        body: JSON.stringify(data)
    }).then((response) => {
        if (response.status >= 200 && response.status < 300)
            return response.json();
        else {
            var error = new Error(response.statusText)
            throw error;
        }
    }).catch((reason) => {
        console.log(reason, url, data);
        alert('Call WebApi發生錯誤!');
        return reason;
    });
};

export function fetchFile<T>(url: string, body: any, progress: any = null): Promise<T> {
    return new Promise<T>(function (resolve, reject) {
        let data: FormData = null;

        if (body) {
            data = new FormData()
            for (var key in body) {
                data.append(key, body[key])
            }
        }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.upload.onprogress = progress ? progress : function (e: ProgressEvent) {
            if (e.lengthComputable) {
                var pre = (e.loaded / e.total) * 100;
            }
        };

        xhr.onload = function (e: Event) {

            if (this.status == 200) {
                var resp = JSON.parse(this.response);
                resolve(resp);
            } else {
                reject(this.response);
            };
        };
        xhr.send(data);
    });



    //return fetch(url, {
    //    method: 'POST',
    //    credentials: 'same-origin',
    //    headers: {
    //        //'Content-Type': 'multipart/form-data;boundary=我的自訂義',
    //        'pragma': 'no-cache',
    //        'cache-control': 'no-cache'
    //    },
    //    body: data
    //    })
    //    .then(response => {
    //        if (response.bodyUsed) {
    //            console.log('Hav Run', response, response.body);
    //            consume(response.body.getReader())
    //        }
    //        else
    //        {

    //            console.log(new Date(),'Jerry')
    //        }
    //    })
    //    .catch((reason) => {
    //    console.log(reason, url);
    //    alert('Call WebApi發生錯誤!');
    //    return reason;
    //});
};
export function ft<T>(api_path_obj: ApiPathStruct, params: any = null) {
    if (api_path_obj.method == 'GET')
        return fetchGet<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'POST')
        return fetchPost<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'PUT')
        return fetchPut<T>(gb_approot + api_path_obj.path, params);

    if (api_path_obj.method == 'DELETE')
        return fetchDelete<T>(gb_approot + api_path_obj.path, params);
}