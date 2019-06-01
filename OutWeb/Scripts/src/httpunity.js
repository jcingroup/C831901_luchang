export class HttpProcess {
    constructor() {
        this.API_PATH = {
            LOGIN: "/_SysAdm/Login",
            GET_LIST: "/api/manage/getlist",
            GET_DATA: "/api/manage/getdata",
            SAVE_DATA: "/api/manage/savedata",
            REMOVE_DATA: "/api/manage/removedata"
        }
    }
    
    getApisPath(){
        return this.API_PATH;
    }

    fetchSendGet(url,data) {
        let setting = {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'pragma': 'no-cache',
                'cache-control': 'no-cache'
            }
        };

        console.log(setting);

        return fetch(url, setting)
            .then((response) => {
                console.log(response);
                return response.json();
            }).then((jsonData) => {
                console.log(jsonData);
            }).catch((err) => {
                console.log('錯誤:', err);
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


