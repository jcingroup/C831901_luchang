"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = {
    dateFT: 'yyyy-MM-dd',
    dateTimeFT: 'YYYY-MM-DD HH:mm',
    RegNewLineBR: /(?:\\[rn]|[\r\n]+)+/g,
    defGridRows: 10,
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
    modalClose: 'modal-close',
    modalSm: 'modal modal-sm',
    modalMd: 'modal',
    btnReport: 'btn'
};
//登錄身分別
exports.lg_type = {
    System: 'S',
    Admin: 'A',
    Examine: 'B',
    Users: 'C',
    Analysis: 'D',
    GroupSystemManagers: 'F',
    GroupManagers: 'G',
    Inner: 'H',
    Energy: 'I' // 能源局
};
exports.pw_rule = {
    r1_view: [exports.lg_type.System, exports.lg_type.Admin, exports.lg_type.Examine, exports.lg_type.Users, exports.lg_type.Analysis, exports.lg_type.Inner, exports.lg_type.Energy],
    r2_app: [exports.lg_type.System, exports.lg_type.Admin, exports.lg_type.Examine, exports.lg_type.Users],
    r3_exam: [exports.lg_type.System, exports.lg_type.Admin, exports.lg_type.Examine],
    r4_vwexam: [exports.lg_type.System, exports.lg_type.Admin, exports.lg_type.Examine, exports.lg_type.Users, exports.lg_type.Analysis, exports.lg_type.Inner, exports.lg_type.Energy],
    r5_quser: [exports.lg_type.System, exports.lg_type.Admin, exports.lg_type.Examine, exports.lg_type.Analysis, exports.lg_type.Inner, exports.lg_type.Energy],
    r6_adm: [exports.lg_type.Admin, exports.lg_type.System] //最高管理權限
};
function testPow(s, login_type) {
    let c = login_type;
    //console.log(s, c, s.indexOf(c));
    return s.indexOf(c) > -1;
}
exports.testPow = testPow;
function getPowTxt(b, tText = gb_Lang.modify, fText = gb_Lang.view) {
    //console.log(b, tText, fText)
    return b ? tText : fText;
}
exports.getPowTxt = getPowTxt;
exports.err_code = {
    ExpectCode: 100,
    NotAuthorize: 101,
    HasErrList: 102,
    ModelNotValid: 103
};
//提示報表未完成訊息
exports.modal_css = {
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
};
