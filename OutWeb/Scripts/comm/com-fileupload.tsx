import React = require('react');
import ReactDOM = require('react-dom');
import { fetchGet, fetchPost, fetchFile } from './ajax';
import * as Modal from 'react-modal';
import { config, modal_css, pw_rule } from '../def-data'
import { makeInputValue, tosMessage, floatSpot, formatFileSize } from './comm-func';

interface FileUpBtnProps {

    id: string | number; //系統Id
    fileKey: string //系統要參照的檔案上傳規範
    title?: string

    inputViewMode?: InputViewMode
    inputClassName?: string;
    inputWithDataClassName?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    isCopyLastYear?: boolean;

    upload_text?: string;
    finish_text?: string;

    accepts?: string;
    accept_text?: string;
    hub?: any

    is_img?: boolean;
    is_model?: boolean;

    //upload&del roles
    haveRolesSet?: boolean;//是否需要 檔案上傳&檔案刪除 權限驗證
    roles?: string[];//可檔案上傳&刪除的權限
    role?: string;//目前權限

    uploadFileName?: string //上傳檔案的參數名稱
}
interface FileUpBtnState {
    is_open?: boolean,
    files?: Array<SerializeFile>,
    cho_name?: string

    //limitcount?: number
    //limitsize?: number
    filescope?: ImageUpScope
}
export default class FileUpBtn extends React.Component<FileUpBtnProps, FileUpBtnState>{

    options_file = null

    private up_path: string = gb_approot + 'api/FileHdl/Up';
    private ls_path: string = gb_approot + 'api/FileHdl/List';
    private de_path: string = gb_approot + 'api/FileHdl/Del';
    private dw_path: string = gb_approot + 'api/FileHdl/Down';
    //private cp_path: string = gb_approot + 'FileHdl/copyLastYear';
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.close = this.close.bind(this);
        this.listFile = this.listFile.bind(this);
        this.down = this.down.bind(this);
        this.delete = this.delete.bind(this);
        this.startSelectFile = this.startSelectFile.bind(this);
        this.selectedFile = this.selectedFile.bind(this);
        this.state = {
            is_open: false,
            cho_name: '未選擇',
            files: [],
            filescope: null
        }
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        inputClassName: 'btn oi success',
        inputWithDataClassName: 'btn oi warning',
        title: '檔案上傳',
        isCopyLastYear: false,
        upload_text: '檔案上傳',
        finish_text: '檢視資料',
        is_img: false,
        accepts: ' .jpg, .jpeg, .png',
        accept_text: 'JPG, JPEG, PNG',
        haveRolesSet: false,
        roles: [],
        role: null,
        is_model: false,
        uploadFileName: 'fileObject'
    }
    componentDidMount() {
        this.listFile();
    }
    componentDidUpdate(prevProps, prevState) {
        let pp = this.props;
        //console.log(prevProps.fileKey, pp.fileKey, prevProps.fileKey, pp.id);
        if (!prevProps.id && pp.id) {
            this.listFile();
        }
    }
    listFile() {
        let pp = this.props;
        if (pp.id && pp.fileKey) {
            let p = {
                id: pp.id,
                key: pp.fileKey
            }
            fetchGet<SerializeFileList>(this.ls_path, p).then((data) => {
                //console.log('check data', data);
                if (data.state == 0) {
                    this.setState({ files: data.files, cho_name: '未選擇', filescope: data.filescope })
                }
            })
        }
    }
    onClick(e: React.SyntheticEvent<EventTarget>) {
        this.setState({ is_open: true })
    }
    close(e) {
        this.setState({ is_open: false })
    }
    down(guid, e) {
        let pp = this.props;

        let pack_param = {
            id: pp.id,
            key: pp.fileKey,
            guid: guid
        }

        ifrmDown(this.dw_path, pack_param);
    }
    delete(guid, e) {
        if (confirm(gb_Lang.delete_sure)) {
            let pp = this.props;

            let pa = {
                id: pp.id,
                key: pp.fileKey,
                guid: guid
            }
            fetchPost(this.de_path, pa).then((data: ResultBase) => {
                if (data.state == 0) {
                    this.listFile();
                    if (this.props.hub) {
                        this.props.hub.server.getListFile();
                    }
                } else if (data.state == 1) {
                    alert('無此檔案')
                }
                else if (data.state == 1000)
                    alert(data.message)
            })
        }
    }
    startSelectFile(e) {

        let f = document.getElementById('skyfile');
        f.click();
    }
    selectedFile(e) {
        let t = e.target as HTMLInputElement;
        if (t.value) {
            //console.log(t.value);

            if (t.files) {

                let { uploadFileName, fileKey, id } = this.props;
                let pom = [];

                for (var i = 0; i < t.files.length; i++) {
                    let _f = t.files[i];

                    let p = {
                        [uploadFileName]: _f,
                        key: fileKey,
                        id: id
                    }

                    let _ft = fetchFile(this.up_path, p)

                    _ft.then(res => {
                        console.log(new Date(), res);
                    })

                    pom.push(_ft);
                }

                Promise.all(pom).then((res) => {
                    this.listFile();
                })
            }
        }
        return false;
    }


    render() {

        let out_html = null;
        let link = null;
        let st = this.state;
        let pp = this.props;

        if (!st.filescope) return null;

        let n_file = <span>{this.props.upload_text}</span>;  //尚未有任何檔案
        let y_file = <span>{this.props.finish_text}</span>;  //已經有檔案

        link = <a className={st.files.length > 0 ? this.props.inputWithDataClassName : this.props.inputClassName} href="#" onClick={this.onClick} data-glyph="image">
            {st.files.length > 0 ? y_file : n_file}
        </a>;

        let _self = this;
        let accept = _self.state.filescope.allowExtType.join(',');

        let enabled: boolean = true;
        //console.log('check open', st.is_open)
        if (pp.is_model) {
            out_html = <div>
                {link}
                <Modal
                    isOpen={st.is_open}
                    className={config.modalMd}
                    overlayClassName={config.modalOverlay}
                    contentLabel="No Overlay Click Modal">

                    <section className="modal-content animate-top">
                        <header>{this.props.title}</header>{/*上傳標題*/}
                        <button type="button" onClick={this.close} className={config.modalClose}>{gb_Lang.close}</button>

                        <div className="react-file-upload form-list">
                            {
                                !pp.disabled ? <dl className="fields">
                                    <dt className="col-2">{this.props.title}</dt>
                                    <dd className="col-10 text-left">
                                        {
                                            (st.files.length < st.filescope.limitCount) ?
                                                <div>
                                                    <div ref="chooseBtn" className="input-file">
                                                        <strong className="oi" data-glyph="magnifying-glass">
                                                            請選擇檔案
                                                            </strong>
                                                        <label>{this.state.cho_name}</label>
                                                    </div>
                                                    <div ref="uploadBtn">
                                                        <button type="button" className="btn success oi" data-glyph="data-transfer-upload">
                                                            檔案上傳
                                                        </button>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                    </dd>
                                </dl> : null
                            }
                            {
                                st.files.length > 0 ?
                                    <dl className="fields">
                                        <dt className="col-2">已上傳檔案清單</dt>
                                        <dd className="col-10">
                                            {
                                                this.state.files.map((item, i) => {
                                                    return <div className="uploaded oi" data-glyph="paperclip" key={item.fileName + '_' + i}>
                                                        <button type="button" onClick={this.delete.bind(this, item.guid)} disabled={pp.disabled} className="btn-link oi" title="刪除此筆檔案" data-glyph="x"></button>
                                                        {
                                                            pp.is_img ?
                                                                <a href="#" onClick={this.down.bind(this, item.guid)}>
                                                                    <img src={item.iconPath} alt={item.fileName} />
                                                                </a> :
                                                                <a href="#" onClick={this.down.bind(this, item.guid)}>{item.fileName}</a>
                                                        }

                                                    </div>;
                                                })
                                            }
                                        </dd>
                                    </dl> : <dl className="field mt-24"><dt className="col-12"><p className="alert-warning text-center">目前無上傳任何檔案</p></dt></dl>
                            }
                        </div>

                        <footer className="text-left">
                            <ol>
                                <li>本系統允許上傳 {this.props.accept_text} 類型的檔案。</li>
                                <li>單個檔案大小不能超過 {formatFileSize(st.filescope.limitSize)}，最多可上傳 {st.filescope.limitCount} 個檔案，謝謝！</li>
                            </ol>
                        </footer>
                    </section>
                </Modal>
            </div>;
        } else {
            out_html = <div className="react-file-upload">
                {!pp.disabled ? [<div className="input-file" key="file-up">
                    {//超過上傳數量限制
                        (st.files.length < st.filescope.limitCount) ? <div>
                            <label className="align-middle">{this.state.cho_name}</label>
                            <button
                                onClick={this.startSelectFile}
                                type="button"
                                disabled={pp.disabled}
                                className="btn warning sm oi" data-glyph="data-transfer-upload">
                                檔案上傳
                                </button>
                        </div> : null
                    }
                </div>,
                <div className="font-sm" key="file-info">
                    本系統允許上傳 {st.filescope.allowExtType} 類型的檔案。<br />
                    單個檔案大小建議不超過 {formatFileSize(st.filescope.limitSize)}，最多可上傳 {st.filescope.limitCount} 個檔案，謝謝！
                    {(st.filescope.Parm.length > 0) ? <span><br />最佳瀏覽尺寸: {st.filescope.Parm[0].heigh ? "高度不超過 " + st.filescope.Parm[0].heigh + " px, " : null}{st.filescope.Parm[0].width ? "寬度不超過 " + st.filescope.Parm[0].width + " px" : null}</span> : null}
                </div>] : ((st.files.length <= 0) ? <p>無上傳任何檔案</p> : null)
                }
                {
                    st.files.length > 0 ?
                        <div className="uploaded-list">
                            {
                                this.state.files.map((item, i) => {
                                    return <div className="uploaded" key={item.fileName + '_' + i}>
                                        {
                                            !pp.disabled ?
                                                <button type="button" onClick={this.delete.bind(this, item.guid)} className="close" title="刪除此筆檔案">&times;</button> :
                                                null
                                        }
                                        {
                                            pp.is_img ?
                                                <a href="#" onClick={this.down.bind(this, item.guid)}>
                                                    <img src={item.iconPath} alt={item.fileName} />
                                                </a> :
                                                <a href="#" onClick={this.down.bind(this, item.guid)} className="oi" data-glyph="paperclip">{item.fileName}</a>
                                        }
                                    </div>;
                                })
                            }
                        </div> : null
                }
                <input type="file" id="skyfile" onChange={this.selectedFile} multiple={false} style={{ display: 'none' }} accept={pp.accepts} />
            </div>;
        }


        return out_html;
    }
}
export class FileUpXHR extends React.Component<FileUpBtnProps, FileUpBtnState>{

    options_file = null

    private up_path: string = gb_approot + 'api/FileHdl/Up';
    private ls_path: string = gb_approot + 'api/FileHdl/List';
    private de_path: string = gb_approot + 'api/FileHdl/Del';
    private dw_path: string = gb_approot + 'api/FileHdl/Down';
    //private cp_path: string = gb_approot + 'FileHdl/copyLastYear';
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.close = this.close.bind(this);
        this.listFile = this.listFile.bind(this);
        this.down = this.down.bind(this);
        this.delete = this.delete.bind(this);
        this.startSelectFile = this.startSelectFile.bind(this);
        this.selectedFile = this.selectedFile.bind(this);
        this.state = {
            is_open: false,
            cho_name: '未選擇',
            files: [],
            filescope: null
        }
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        inputClassName: 'btn oi success',
        inputWithDataClassName: 'btn oi warning',
        title: '檔案上傳',
        isCopyLastYear: false,
        upload_text: '檔案上傳',
        finish_text: '檢視資料',
        is_img: false,
        accepts: ' .jpg, .jpeg, .png',
        accept_text: 'JPG, JPEG, PNG',
        haveRolesSet: false,
        roles: [],
        role: null,
        is_model: false,
        uploadFileName: 'fileObject'
    }
    componentDidMount() {
        this.listFile();
    }
    componentDidUpdate(prevProps, prevState) {
        let pp = this.props;
        //console.log(prevProps.fileKey, pp.fileKey, prevProps.fileKey, pp.id);
        if (!prevProps.id && pp.id) {
            this.listFile();
        }
    }
    listFile() {
        let pp = this.props;
        if (pp.id && pp.fileKey) {
            let p = {
                id: pp.id,
                key: pp.fileKey
            }
            fetchGet<SerializeFileList>(this.ls_path, p).then((data) => {
                if (data.state == 0) {
                    this.setState({ files: data.files, cho_name: '未選擇', filescope: data.filescope })
                }
            })
        }
    }
    onClick(e: React.SyntheticEvent<EventTarget>) {
        this.setState({ is_open: true })
    }
    close(e) {
        this.setState({ is_open: false })
    }
    down(guid, e) {
        let pp = this.props;

        let pack_param = {
            id: pp.id,
            key: pp.fileKey,
            guid: guid
        }

        ifrmDown(this.dw_path, pack_param);
    }
    delete(guid, e) {
        if (confirm(gb_Lang.delete_sure)) {
            let pp = this.props;

            let pa = {
                id: pp.id,
                key: pp.fileKey,
                guid: guid
            }
            fetchPost(this.de_path, pa).then((data: ResultBase) => {
                if (data.state == 0) {
                    this.listFile();
                    if (this.props.hub) {
                        this.props.hub.server.getListFile();
                    }
                } else if (data.state == 1) {
                    alert('無此檔案')
                }
                else if (data.state == 1000)
                    alert(data.message)
            })
        }
    }
    startSelectFile(e) {

        let f = document.getElementById('skyfile');
        f.click();
    }
    selectedFile(e) {
        let t = e.target as HTMLInputElement;
        if (t.value) {
            //console.log(t.value);

            if (t.files) {

                let { uploadFileName, fileKey, id } = this.props;
                let pom = [];

                for (var i = 0; i < t.files.length; i++) {
                    let _f = t.files[i];

                    let p = {
                        [uploadFileName]: _f,
                        key: fileKey,
                        id: id
                    }

                    let _ft = fetchFile(this.up_path, p, function (e: ProgressEvent) {
                        //上傳中 處理
                        if (e.lengthComputable) {
                            var p = (e.loaded / e.total) * 100;
                            console.log(p + '% uploaded');
                        }
                    })

                    _ft.then(res => {

                    }).catch(err => {

                    })

                    pom.push(_ft);
                }

                Promise.all(pom).then((res) => {
                    this.listFile();
                })
            }
        }
        return false;
    }

    render() {

        let out_html = null;
        let link = null;
        let st = this.state;
        let pp = this.props;

        if (!st.filescope) return null;

        let n_file = <span>{this.props.upload_text}</span>;  //尚未有任何檔案
        let y_file = <span>{this.props.finish_text}</span>;  //已經有檔案

        link = <a className={st.files.length > 0 ? this.props.inputWithDataClassName : this.props.inputClassName} href="#" onClick={this.onClick} data-glyph="image">
            {st.files.length > 0 ? y_file : n_file}
        </a>;

        let _self = this;
        let accept = _self.state.filescope.allowExtType.join(',');

        let enabled: boolean = true;
        //console.log('check open', st.is_open)
        if (pp.is_model) {
            out_html = <div>
                {link}
                <Modal
                    isOpen={st.is_open}
                    className={config.modalMd}
                    overlayClassName={config.modalOverlay}
                    contentLabel="No Overlay Click Modal">

                    <section className="modal-content animate-top">
                        <header>{this.props.title}</header>{/*上傳標題*/}
                        <button type="button" onClick={this.close} className={config.modalClose}>{gb_Lang.close}</button>

                        <div className="react-file-upload form-list">
                            {
                                !pp.disabled ? <dl className="fields">
                                    <dt className="col-2">{this.props.title}</dt>
                                    <dd className="col-10 text-left">
                                        {
                                            (st.files.length < st.filescope.limitCount) ?
                                                <div>
                                                    <div ref="chooseBtn" className="input-file">
                                                        <strong className="oi" data-glyph="magnifying-glass">
                                                            請選擇檔案
                                                            </strong>
                                                        <label>{this.state.cho_name}</label>
                                                    </div>
                                                    <div ref="uploadBtn">
                                                        <button type="button" className="btn success oi" data-glyph="data-transfer-upload">
                                                            檔案上傳
                                                        </button>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                    </dd>
                                </dl> : null
                            }
                            {
                                st.files.length > 0 ?
                                    <dl className="fields">
                                        <dt className="col-2">已上傳檔案清單</dt>
                                        <dd className="col-10">
                                            {
                                                this.state.files.map((item, i) => {
                                                    return <div className="uploaded oi" data-glyph="paperclip" key={item.fileName + '_' + i}>
                                                        <button type="button" onClick={this.delete.bind(this, item.guid)} disabled={pp.disabled} className="btn-link oi" title="刪除此筆檔案" data-glyph="x"></button>
                                                        {
                                                            pp.is_img ?
                                                                <a href="#" onClick={this.down.bind(this, item.guid)}>
                                                                    <img src={item.iconPath} alt={item.fileName} />
                                                                </a> :
                                                                <a href="#" onClick={this.down.bind(this, item.guid)}>{item.fileName}</a>
                                                        }

                                                    </div>;
                                                })
                                            }
                                        </dd>
                                    </dl> : <dl className="field mt-24"><dt className="col-12"><p className="alert-warning text-center">目前無上傳任何檔案</p></dt></dl>
                            }
                        </div>

                        <footer className="text-left">
                            <ol>
                                <li>本系統允許上傳 {this.props.accept_text} 類型的檔案。</li>
                                <li>單個檔案大小不能超過 {formatFileSize(st.filescope.limitSize)}，最多可上傳 {st.filescope.limitCount} 個檔案，謝謝！</li>
                            </ol>
                        </footer>
                    </section>
                </Modal>
            </div>;
        } else {
            out_html = <div className="react-file-upload">
                {!pp.disabled ? [<div className="input-file" key="file-up">
                    {//超過上傳數量限制
                        (st.files.length < st.filescope.limitCount) ? <div>
                            <label className="align-middle">{this.state.cho_name}</label>
                            <button
                                onClick={this.startSelectFile}
                                type="button"
                                disabled={pp.disabled}
                                className="btn warning sm oi" data-glyph="data-transfer-upload">
                                檔案上傳
                                </button>
                        </div> : null
                    }
                </div>,
                <div className="font-sm" key="file-info">
                    本系統允許上傳 {st.filescope.allowExtType} 類型的檔案。<br />
                    單個檔案大小建議不超過 {formatFileSize(st.filescope.limitSize)}，最多可上傳 {st.filescope.limitCount} 個檔案，謝謝！
                    {(st.filescope.Parm.length > 0) ? <span><br />最佳瀏覽尺寸: {st.filescope.Parm[0].heigh ? "高度不超過 " + st.filescope.Parm[0].heigh + " px, " : null}{st.filescope.Parm[0].width ? "寬度不超過 " + st.filescope.Parm[0].width + " px" : null}</span> : null}
                </div>] : ((st.files.length <= 0) ? <p>無上傳任何檔案</p> : null)
                }
                {
                    st.files.length > 0 ?
                        <div className="uploaded-list">
                            {
                                this.state.files.map((item, i) => {
                                    return <div className="uploaded" key={item.fileName + '_' + i}>
                                        {
                                            !pp.disabled ?
                                                <button type="button" onClick={this.delete.bind(this, item.guid)} className="close" title="刪除此筆檔案">&times;</button> :
                                                null
                                        }
                                        {
                                            pp.is_img ?
                                                <a href="#" onClick={this.down.bind(this, item.guid)}>
                                                    <img src={item.iconPath} alt={item.fileName} />
                                                </a> :
                                                <a href="#" onClick={this.down.bind(this, item.guid)} className="oi" data-glyph="paperclip">{item.fileName}</a>
                                        }
                                    </div>;
                                })
                            }
                        </div> : null
                }
                <input type="file" id="skyfile" onChange={this.selectedFile} multiple={false} style={{ display: 'none' }} accept={pp.accepts} />
            </div>;
        }


        return out_html;
    }
}
export function ifrmDown(download_src, pm) {

    let param = [];
    for (var i in pm)
        param.push(i + '=' + encodeURIComponent(pm[i]));

    let join_param = param.join('&');
    $('#file_down').remove();
    var item = $(this).attr('item');
    var url_append_param = download_src + '?' + join_param;
    var ifram = $('<iframe id="file_down" style="display:none">');
    ifram.attr('src', url_append_param);
    $(document.body).append(ifram);
}