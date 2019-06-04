export const config = {
    dateFT: 'yyyy-MM-dd',
    dateTimeFT: 'YYYY-MM-DD HH:mm',
    RegNewLineBR: /(?:\\[rn]|[\r\n]+)+/g,
    defGridRows: 10, //預設Grid每頁顯示筆數
    btnSmViewCss: "btn btn-sm icon-book",
    btnSmDelCss: 'btn btn-sm icon-trash bg-warning',
    btnSmModifyCss: 'btn btn-sm icon-mode_edit',
    btnModifyCss: 'btn icon-mode_edit',
    btnAddNewCss: 'btn',
    btnSmAddNewCss: 'btn btn-sm icon-plus',
    btnSmWAddNewCss: 'btn btn-sm btn-white icon-plus m-l-8',
    btnReportCss: 'btn icon-inbox',
    btnSmReportCss: 'btn btn-sm icon-inbox',
    btnSmSureCss: 'btn btn-sm icon-check bg-info',
    btnSureCss: 'btn icon-check bg-info',
    btnSmCancelCss: 'btn btn-sm icon-cross bg-muted',
    btnCancelCss: 'btn icon-cross bg-muted',
    btnAppliactionCss: 'btn icon-plus',
    btnSearchCss: 'btn icon-magnifying-glass',
    btnSaveCss: 'btn icon-done',
    btnCancelReturnCss: 'btn bg-warning icon-cross',
    btnReturnCss: 'btn bg-warning icon-reply',
    btnFirstPageCss: 'btn',
    btnPrvePageCss: 'btn',
    btnNextPageCss: 'btn',
    btnLastPageCss: 'btn',
    btnCloseCss: 'btn-close',
    btnSmCss: 'btn btn-sm',
    btnWhite: 'btn btn-white',
    btnSmWhite: 'btn btn-sm btn-white',
    btnCaption: 'font-md p-y-8 m-l-8',
    btnFileUp: 'btn btn-sm icon-outbox',
    btnCopyCss: 'btn btn-sm icon-files-o m-l-8',
    btnWarnCss: 'btn btn-sm bg-danger m-l-12',

    modalOverlay: 'modal',
    modalBase: 'modal',

    modalClose: 'modal-close', //Modal 關閉 Button class name
    modalSm: 'modal modal-sm',
    modalMd: 'modal',
    btnReport: 'btn'
}
//登錄身分別
export const lg_type = {
    System: 'S', //系統開發最高權限
    Admin: 'A', //用戶最高權限
    Examine: 'B', //審查人員
    Users: 'C', //能源用戶
    Analysis: 'D', //研究人員
    GroupSystemManagers: 'F',
    GroupManagers: 'G',
    Inner: 'H', //會內人員
    Energy: 'I' // 能源局
}
export const pw_rule = {
    r1_view: [lg_type.System, lg_type.Admin, lg_type.Examine, lg_type.Users, lg_type.Analysis, lg_type.Inner, lg_type.Energy], //檢視
    r2_app: [lg_type.System, lg_type.Admin, lg_type.Examine, lg_type.Users], //申報
    r3_exam: [lg_type.System, lg_type.Admin, lg_type.Examine], //審核
    r4_vwexam: [lg_type.System, lg_type.Admin, lg_type.Examine, lg_type.Users, lg_type.Analysis, lg_type.Inner, lg_type.Energy], //檢視審核
    r5_quser: [lg_type.System, lg_type.Admin, lg_type.Examine, lg_type.Analysis, lg_type.Inner, lg_type.Energy], //搜尋用戶
    r6_adm: [lg_type.Admin, lg_type.System]//最高管理權限
}
export function testPow(s: string[], login_type: string) { //測試權限
    let c = login_type;
    //console.log(s, c, s.indexOf(c));
    return s.indexOf(c) > -1;
}
export function getPowTxt(b: boolean, tText = gb_Lang.modify, fText = gb_Lang.view) { //依布林值回傳文字 預設為 修改:檢視
    //console.log(b, tText, fText)
    return b ? tText : fText;
}
export const err_code = {
    ExpectCode: 100,
    NotAuthorize: 101,
    HasErrList: 102,
    ModelNotValid: 103
}
//提示報表未完成訊息
export const modal_css = {
    alertHeader: {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.75)'
        },
        content: {
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
        }
    },

    fileUpload: {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            zIndex: 999
        },
        content: {
            position: 'absolute',
            top: '40px',
            left: '40px',
            right: '40px',
            bottom: '40px',
            border: '1px solid #ccc',
            background: '#fff',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            borderRadius: '4px',
            outline: 'none',
            padding: '20px'
        }
    }
}