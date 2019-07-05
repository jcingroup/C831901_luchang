import * as Pom from 'es6-promise';
Pom.polyfill();
import 'whatwg-fetch';

export function EncodeQueryData(data) {

    var ret = [];
    for (var d in data) {
        if (data[d] !== undefined && data[d] !== null && data[d] !== '')
            ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
        else
            ret.push(encodeURIComponent(d) + "=");
    }
    return ret.join("&");
}

export class HttpProcess {
    constructor() {
        this.API_PATH = {
            LOGIN: "/_SysAdm/login",
            GET_LIST: "/api/News/List",
            GET_DATA: "/api/News/Edit",
            SAVE_DATA: "/api/News/Save",
            REMOVE_DATA: "/api/News/Remove",
            CHANGE_PW: "/_SysAdm/ChangePW",
            GET_FRONT_LIST: "/api/Front/News/List",
            GET_FRONT_DATA: "/api/Front/News/Edit"
        };
    }

    getApisPath() {
        return this.API_PATH;
    }

    fetchSendGet(url, data) {
        let _url = url;
        if (typeof data !== 'undefined') {
            const url_param = EncodeQueryData(data);
            var uri = document.location.origin + url;
            _url = uri + (url_param === '' ? '' : '?' + url_param);
        };
        console.log("url", _url);
        let setting = {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'pragma': 'no-cache',
                'cache-control': 'no-cache',
            }
        };


        return fetch(_url, setting)
            .then((response) => {
                return response.json();
            });
    }

    fetchSendPost(url, data) {
        let setting = {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'pragma': 'no-cache',
                'cache-control': 'no-cache'
            },
            body: JSON.stringify(data, true)
        };

        return fetch(url, setting)
            .then((response) => {
                //console.log(response);
                return response.json();
            });
    }


}


