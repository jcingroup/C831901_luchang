import "babel-polyfill";

export const ac = {
    loadmenu: 'loadmenu',
    chgBranchId: 'chgBranchId',
    collapse_menu: 'collapse_menu',
    setMenuSubToRight: 'setMenuSubToRight'
}

export const callLoadMenu = (data) => {
    return {
        type: ac.loadmenu,
        data
    }
}

export const chgBranchId = (value: number) => {
    return {
        type: ac.chgBranchId,
        value
    }
}

export const setMenuSubToRight = (Id: string, menu_name: string) => {
    return {
        type: ac.setMenuSubToRight,
        Id: Id,
        menu_name: menu_name
    }
}