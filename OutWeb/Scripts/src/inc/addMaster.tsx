import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ft } from '../../comm/ajax';
import apipath from '../path/api-menu';
import { callLoadMenu } from './actions';
import MasterLayout from './Masterlayout';
import Routelayout from './Routelayout';
import { MakeKeySwitch } from '../../comm/comm-func'

export function AddMasterMenu(ContextObject, store, menu_id = '0') {

    ft<ReturnData<server.Menu[]>>(apipath.GET_api_Menu_GetByLogin, {})
        .then((res) => {
            console.log(res)
            let storeMenuData: Array<server.Menu>;
            let menu_flat_data: Array<server.Menu> = []

            storeMenuData = res.data;

            // 將資料編平化
            FlatMenu(storeMenuData, menu_flat_data);
            // 啟動快捷鍵
            let m1 = MakeKeySwitch(500, function (key_context: string) {

                let key_last_context = key_context.trim().toUpperCase();
                if (menu_flat_data.some(x => x.Id == key_last_context))
                    KeyOpenRoute(key_last_context);
            })
            m1.start();
            var dom = document.getElementById('page_content');
            render(<Provider store={store}>
                <MasterLayout store={store}>
                    <ContextObject />
                </MasterLayout>
            </Provider>, dom);

            store.dispatch(callLoadMenu(storeMenuData));
        })
}

function FlatMenu(data: Array<server.Menu>, push_data: Array<server.Menu>) {

    for (var idx in data) {
        let menu = data[idx];
        // JSON 的menu id有可能沒有設定到
        //if (menu.Id && menu.Id.substring(0, 1) == 'P')
        if (menu.Id)
            push_data.push(menu);

        if (menu.Items && menu.Items.length > 0) {
            FlatMenu(menu.Items, push_data);
        }
    }
}
export function KeyOpenRoute(Id: string) {
    window.open(gb_approot + 'ProgRoute/Route?Id=' + Id, Id, "height=800, width=1200, toolbar=no, menubar=no, location=no, status=no");
}

export function LayoutRoute(ContextObject, store) {

    ft<ReturnData<server.Menu[]>>(apipath.GET_api_Menu_GetByLogin, {})
        .then((res) => {

            let storeMenuData: Array<server.Menu> = res.data;
            let menu_flat_data: Array<server.Menu> = []

            FlatMenu(storeMenuData, menu_flat_data);

            // 啟動快捷鍵
            let m1 = MakeKeySwitch(500, function (key_context: string) {

                let key_last_context = key_context.trim().toUpperCase();
                if (menu_flat_data.some(x => x.Id == key_last_context))
                    KeyOpenRoute(key_last_context);
            })
            m1.start();

            let get_prog_menu = menu_flat_data.find(x => x.Id == gb_menu_id);

            if (!get_prog_menu)
                alert('Module Not Found');

            let record_path_strace: Array<string> = [];
            get_prog_menu.PathStrace.forEach((Id) => {
                let path_menu = menu_flat_data.find(x => x.Id == Id);
                record_path_strace.push(path_menu.ItemName);
            })

            var dom = document.getElementById('page_content');
            render(<Provider store={store}>
                <Routelayout store={store} prog_menu={get_prog_menu} breadcrumb={record_path_strace}>
                    <ContextObject />
                </Routelayout>
            </Provider>, dom);

            store.dispatch(callLoadMenu(res.data));
        })
}