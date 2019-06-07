export class HttpProcess {
    constructor() {
        this.API_PATH = {
            LOGIN: "/_SysAdm/login",
            GET_LIST: "/api/News/List",
            GET_DATA: "/api/News/Edit",
            SAVE_DATA: "/api/News/Save",
            REMOVE_DATA: "/api/News/Remove",
            CHANGE_PW: "/_SysAdm/ChangePW"
        }
    }

    getApisPath() {
        return this.API_PATH;
    }

    fetchSendGet(url, data) {
        let _url = url;
        if (typeof data !== 'undefined') {
            var uri = new URL(document.location.origin  + url)
            Object.keys(data).forEach(key => uri.searchParams.append(key, data[key]))      
            _url = uri;
        };

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
            body: JSON.stringify(data)
        };

        return fetch(url, setting)
            .then((response) => {
                //console.log(response);
                return response.json();
            });
    }


}


