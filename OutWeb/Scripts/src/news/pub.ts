/**
    系統名稱:資料維護
    檔案內容:共用設定
    2017-03-31  Jerry   建立
*/
///<reference path="../../ts.d/IAjaxResult.d.ts" />
///<reference path="../../ts.d/server/News.d.ts" />

import { ft } from '../../comm/ajax';
import { guid, tosMessage, packegeErrList } from '../../comm/comm-func';
import ap from '../path/api-news';
import { err_code } from '../../def-data';
import { mask_show, mask_off } from '../../comm/vwMaskLoading';
import { WarpCommParm } from '../../comm/dopack'
import { menu_tree, MenuFlow, menu_click_id_to_right } from '../inc/reducers';
import cbnReduce from '../inc/cbnReduce';
import update from 'immutability-helper';
import "babel-polyfill";

export const ac = {

    grid_data: 'grid_data',

    empty: 'empty', //空的 store不可使用
    load: 'load',
    page: 'page',
    setpage: 'setpage',
    chgFdlVal: 'chgFdlVal',
    chgTotal:'chgTotal',
    chgQryVal: 'chgQryVal',
    submitOK: 'submitOK',
    submitNot: 'submitNot',
    submitDel: 'submitDel',
    cancel: 'cancel',
    modify: 'modify',
    insert: 'insert',
    return: 'return'
}

// action
export const ACInputValue = (field, value) => {

    return {
        type: ac.chgFdlVal,
        field,
        value
    }
}

export const ACQueryValue = (field, value) => {

    return {
        type: ac.chgQryVal,
        field,
        value
    }
}
export const ACCancel = (data) => {
    return {
        type: ac.cancel,
        data
    }
}
export const ACReturnGridView = () => {
    return {
        type: ac.return
    }
}
export const ACInsertModel = () => {
    let r: { type: string, data: server.News } = {
        type: ac.insert,
        data: {// 新增值初始化
            news_id: guid(),
            state: 'A',
            lang: 'en-US'
        }
    }
    return r;
}

export const ACSetToPage = (data) => {
    let r = {
        type: ac.setpage,
        data
    }
    return r;
}

// action & ajax call

export async function ACCallGrid(page: number, field: string, sort: string, query: object, is_query_item: boolean) {
    //mask_show(lang.mk_loading);

    let pm_first = {
        page,
        _sort: sort,
        _field: field,
        is_query_item
    };

    let pm_query = Object.assign(query, pm_first);
    let pm_result = WarpCommParm(pm_query);

    let res: ReturnData<GridInfo<server.News>> = await ft(ap.GET_API_News, pm_result);
    if (res.state > 0)
        alert(res.message);
    else
        return {
            type: ac.load,
            data: res.data,
            exist: res.exist
        }
}

export async function AddCallGrid(field, value) {
    return {
        type: ac.chgFdlVal,
        field,
        value
    }
}


export async function ACCallLoad(p) {
    mask_show(gb_Lang.mk_loading);
    let pm: PBase = {};
    let res = await ft<ReturnData<GridInfo<server.News>>>(ap.GET_API_News, pm);

    mask_off();
    if (res.state > 0)
        alert(res.message);
    else
        return {
            type: ac.load,
            data: res.data,
            exist: res.exist
        }
}
export async function ACCallPage(p) {

    let pm = WarpCommParm(p);
    let res = await ft<ReturnData<GridInfo<server.News>>>(ap.GET_API_News, pm);
    mask_off();
    if (res.state > 0) {
        tosMessage(null, res.message, ToastrType.error);
        return {
            type: ac.empty
        };
    }
    else
        return {
            type: ac.load,
            data: res.data,
            exist: res.exist
        }
}
export async function ACCallEdit(id) {

    mask_show(gb_Lang.mk_loading);
    let tm = { id };
    let pm = WarpCommParm(tm);
    let data = await ft<ReturnData<server.News>>(ap.GET_API_News_Item, pm);
    mask_off();
    if (data.state > 0) {
        alert(data.message);
        return;
    }

    return {
        type: ac.modify,
        data: data.data
    };
}
export async function ACCallRemove(id, p) {

    mask_show(gb_Lang.mk_updating);
    let tm = { id };
    let pm = WarpCommParm(tm);
    let data = await ft<ResultBase>(ap.POST_API_News_Remove, pm);
    mask_off();
    if (data.state > 0) {
        tosMessage('', data.message, ToastrType.error);
    } else {
        tosMessage('', gb_Lang.fi_delete, ToastrType.success);
        return {
            type: ac.submitDel
        }
    }

}
export async function ACSubmit(id: string | number, edit_type: IEditType, data: server.News) {

    let tm = { id, md: data };
    let pm = WarpCommParm(tm);

    if (edit_type == IEditType.modify) {

        let data = await ft<ReturnUpdate<any>>(ap.POST_API_News_Update, pm);
        if (data.state == err_code.HasErrList) {
            let err_message = packegeErrList(data.err_list);
            tosMessage('', err_message, ToastrType.error)
        } else if (data.state > 0) {
            alert(data.message);
        }
        else {
            tosMessage('', gb_Lang.fi_update, ToastrType.success)
            return dispatch => {
                dispatch({ type: ac.submitOK, data: tm.md });
            }
        }
    } else if (edit_type == IEditType.insert) {
        let data = await ft<ReturnUpdate<any>>(ap.POST_API_News, pm);

        if (data.state == err_code.HasErrList) {
            let err_message = packegeErrList(data.err_list);
            tosMessage('', err_message, ToastrType.error)
        } else if (data.state > 0) {
            tosMessage('', data.message, ToastrType.error)
            return { type: ac.submitNot, field: tm.md };
        }
        else {
            tosMessage(gb_Lang.update_info, gb_Lang.fi_insert, ToastrType.success);
            return dispatch => {
                dispatch(ACCallEdit(data.id));
            }
        }
    }
}

//reduces
const page_grid = (state: GridInfo<server.News> = { rows: [] }, action): GridInfo<server.News> => {

    let struct = {};
    let n_state;

    switch (action.type) {

        case ac.load:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;

        case ac.page:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;

        case ac.setpage:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;

        default:
            return state;
    }
}
const search = (state = {}, action) => {

    let struct = {};
    let n_state = {};

    switch (action.type) {

        case ac.chgQryVal:

            let { field, value } = action;
            struct = {
                [field]: { $set: value }
            };

            n_state = update(state, struct);
            return n_state;

        default:
            return state;
    }
}
const edit_type = (state = IEditType.none, action): IEditType => {
    switch (action.type) {
        case ac.insert:
            return IEditType.insert;
        case ac.modify:
            return IEditType.modify;
        case ac.submitOK:
            return IEditType.none;
        case ac.return:
            return IEditType.none;
        default:
            return state;
    }
}
const view_mode = (state = InputViewMode.edit, action): InputViewMode => {
    switch (action.type) {
        default:
            return state
    }
}
const field = (state = {}, action): server.News => {

    let struct = {};
    let n_state = {};

    switch (action.type) {
        case ac.insert:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;

        case ac.modify:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;

        case ac.chgFdlVal:

            let { field, value } = action;
            struct = {
                [field]: { $set: value }
            };

            n_state = update(state, struct);
            return n_state;
        case ac.submitOK:

            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;

        case ac.cancel:

            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;

        case ac.return:

            return {};

        default:
            return state
    }
}
const kfield = (state = {}, action): server.News => {

    let struct = {};
    let n_state = {};

    switch (action.type) {
        case ac.insert:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;
        case ac.modify:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;
        case ac.submitOK:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);

            return n_state;
        default:
            return state
    }
}
const exist = (state = false, action) => {
    switch (action.type) {
        case ac.load:
            return action.exist;
        case ac.submitOK:
            return true;
        default:
            return state
    }
}
const oper_id = (state = guid(), action) => {
    switch (action.type) {
        case ac.submitOK:
            return guid();
        case ac.submitDel:
            return guid();
        case ac.chgQryVal: //自動查詢
            return guid();
        case ac.return:
            return guid();
        default:
            return state
    }
}


const changeValue = (state = { news_numberX: 0, news_numberY: 0 }, action) => {

    let struct = {};
    let n_state = {};


    switch (action.type) {
        case AddCallGrid:
            struct = {
                $set: action.data
            };

            n_state = update(state, struct);
            return n_state;
        default:
            return state
    }
}


export let store = cbnReduce({ menu_click_id_to_right, menu_tree, MenuFlow, oper_id, search, page_grid, edit_type, view_mode, field, kfield, exist, changeValue });
//export let store = cbnReduce({ menu_click_id_to_right, menu_tree, oper_id, search, page_grid, edit_type, view_mode, field, kfield, exist });