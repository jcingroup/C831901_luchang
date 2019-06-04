//系統共用 Store
import { ac } from './actions';
import update from 'immutability-helper';
//選單結構資料
export const menu_tree = (state: Array<server.Menu> = [], action) => {
    let struct = {};
    let n_state;

    switch (action.type) {
        case ac.loadmenu:
            struct = {
                $set: action.data
            };
            n_state = update(state, struct);
            return n_state;

        case ac.collapse_menu:
            return action.data;

        default:
            return state;
    }
}

export const MenuFlow = (state = { branch_id: 0, now_menu_name: null }, action) => {
    let struct = {};
    let n_state;

    switch (action.type) {
        case ac.loadmenu:
            struct = {
                branch_id: { $set: 0 }
            };
            n_state = update(state, struct);
            return n_state;
        case ac.chgBranchId:
            struct = {
                branch_id: { $set: action.Id }
            };
            n_state = update(state, struct);
            return n_state;

        case ac.setMenuSubToRight:
            struct = {
                now_menu_name: { $set: action.menu_name }
            };
            n_state = update(state, struct);
            return n_state;

        default:
            return state;
    }
}

export const menu_click_id_to_right = (state: string = null, action) => {
    let struct = {};
    let n_state: string;

    switch (action.type) {
        case ac.setMenuSubToRight:
            return action.Id;
        default:
            return state;
    }
}