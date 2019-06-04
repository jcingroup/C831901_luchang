/* 承心 2016-08-09
** 編輯檢視共用元件 依據傳入 InputViewMode 屬性進行切換
*/

///<reference path="../ts.d/SelectTextOptions.d.ts" />

import React = require('react');
import ReactDOM = require('react-dom');
import { makeInputValue, pad, isNumeric, tosMessage, fmtMoney, floatSpot, formatFileSize } from './comm-func';
import { config, modal_css, pw_rule } from '../def-data'
import { twDistrict } from './twDistrict';

import * as Modal from 'react-modal';
import FileUpload = require('react-fileupload');
import { fetchGet, fetchPost } from './ajax';

//Input
interface InputTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    type?: string;
    id?: string;
    required?: boolean;
    maxLength?: number;
    onBlur?: React.EventHandler<React.FocusEvent<EventTarget>>;
    onFocus?: React.EventHandler<React.FocusEvent<EventTarget>>;
    ref?: string | any;
    tabIndex?: number;
    patternString?: string;
    patternInfo?: string;
    onInput?: string;
    autoFocus?: string;
    onclick?: string;
    placeholder?: string
    notChinese?: boolean;

    dataTip?: string;
    dataFor?: string
}
export class InputText extends React.Component<InputTextProps, any>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.prvText = null;
    }
    prvText: string | number
    static defaultProps = {
        type: 'text',
        disabled: false,
        inputViewMode: InputViewMode.edit,
        notChinese: false
    }
    onChange(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);
        this.props.onChange(value, e);
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;
        let set_value = value;
        let testZH = (src) => {
            for (var i = 0; i < src.length; i++) {
                if (src.charCodeAt(i) > 255) {
                    return true;
                }
            }
            return false;
        }

        if (this.props.notChinese && testZH(value))  //如果不能是中文
            set_value = this.prvText;
        else
            this.prvText = value;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <input
                        id={this.props.id}
                        type={this.props.type}
                        className={this.props.inputClassName}
                        width={this.props.width}
                        style={this.props.style}
                        value={set_value}
                        onChange={this.onChange}
                        disabled={this.props.disabled}
                        required={this.props.required}
                        maxLength={this.props.maxLength}
                        onBlur={this.props.onBlur}
                        onFocus={this.props.onFocus}
                        tabIndex={this.props.tabIndex}
                        pattern={this.props.patternString}
                        title={this.props.patternInfo}
                        placeholder={this.props.placeholder}
                        data-for={this.props.dataFor}
                        data-tip={this.props.dataTip}
                    />
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        id={this.props.id}
                        className={this.props.viewClassName}>
                        {set_value}
                    </span>
                );
        }
        return out_html;
    }
}

//Input 只能輸入數字
interface InputNumProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    id?: string;
    required?: boolean;
    maxLength?: number;
    onBlur?: Function;
    onFocus?: React.EventHandler<React.FocusEvent<EventTarget>>;
    tabIndex?: number;
    group?: string;
    ref?: string;
    max?: number;
    min?: number;
    dataFor?: string;
    dataTip?: boolean;
    title?: string;
    hidden?: boolean;
    moneyFmt?: boolean;
    readyonly?: boolean;
    onlyPositive?: boolean; //只能為正數
}
interface InputNumState {
    show_value?: any
    prv_value?: any
    neg_sign_flag?: boolean
}
export class InputNum extends React.Component<InputNumProps, InputNumState>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.state = {
            show_value: null,
            prv_value: null,
            neg_sign_flag: false
        };
    }
    static defaultProps = {
        type: 'text',
        disabled: false,
        inputViewMode: InputViewMode.edit,
        only_positive: true,
        moneyFmt: true
    }
    is_get_value = false;
    componentDidMount() {
        const pp_value = this.props.value;
        this.setState({ show_value: pp_value, prv_value: pp_value });
    }

    componentWillUpdate(nextProps, nextState) {
        //if (this.props.id == "new_building")
        //    console.log('componentWillUpdate', this.props.id, this.props.value, nextProps.value, nextState.show_value);
        //此段 換值時 但上層元件如有做value復元動作  要在此做還原動作
        if (isNumeric(this.props.value) && isNumeric(nextState.show_value) && this.props.value != nextState.show_value) {
            //console.log('change')
            nextState.show_value = this.props.value;
        }
    }
    componentDidUpdate(prevProps, prevState) {

        if (this.props.value != prevProps.value && isNumeric(this.props.value)) {
            const pp_value = this.props.value;
            this.setState({ prv_value: pp_value, show_value: pp_value })
        } else if (this.props.value != prevProps.value && (this.props.value == null || this.props.value == '')) {
            this.setState({ prv_value: '', show_value: '' })
        }
    }
    onChange(e: React.SyntheticEvent<EventTarget>) {

        if (this.props.onChange == undefined || this.props.onChange == null)
            return;

        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = input.value;
        //this.state['neg_sign_flag'] = false;
        //console.log('check value', value);
        if (value === null || value === '' || value === null || value === undefined) {
            this.setState({ prv_value: null, show_value: null })
            this.props.onChange('', e);
            //console.log('num 1 value');
        } else {
            //console.log('num 2 value');
            //console.log('value', value, 'isNumeric', isNumeric(value));
            if (value == '-' && !this.props.onlyPositive) { //可輸入負號
                //console.log('num 3 value');
                this.setState({ show_value: '-', prv_value: value })
                this.props.onChange(0, e);
            } else if (value == '-' && this.props.onlyPositive) { //不可輸入負號
                //console.log('num 4 value');
                this.setState({ show_value: '', prv_value: '' })
                this.props.onChange('', e);
            } else if (value == '.') {//第一位可先打小數點
                //console.log('num 5 value');
                this.setState({ show_value: '.', prv_value: value })
                this.props.onChange(0, e);
            } else if (isNumeric(value)) {
                //console.log('num 6 value');
                let n = parseFloat(value);

                if (this.props.onlyPositive && n < 0) { //不可輸入負號 值卻小於０
                    //console.log('num 7 value');
                    const prv_value = this.state.prv_value === undefined ? '' : this.state.prv_value;
                    this.setState({ show_value: prv_value })
                    this.props.onChange(prv_value, e);
                } else {
                    //console.log('num 8 value');
                    if (n == 0 && !(value.indexOf('.') > -1)) {//打0.顯示value
                        //console.log('num9 value');
                        this.setState({ show_value: n, prv_value: n }) //打000也是數字0
                    } else {
                        //console.log('num 10 value');
                        this.setState({ show_value: value.trim(), prv_value: n }) // 123. 經parseFloat會變成 123
                    }
                    //console.log('num 11 value');
                    this.props.onChange(n, e);
                }

            } else {
                //console.log('num 12 value', this.state.prv_value);
                //console.log('not set')
                const prv_value = (this.state.prv_value === undefined || this.state.prv_value === null) ? '' : this.state.prv_value;
                this.setState({ show_value: prv_value })
                this.props.onChange(prv_value, e);
            }
        }
    }
    onBlur(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = input.value;
        let pp = this.props;
        if (value === '-') {
            //console.log(value);
            this.setState({ show_value: '', prv_value: '' })
            pp.onChange('', e);
        } else {
            if (pp.min != undefined && pp.min != null && pp.value.toString() != '' && pp.value < pp.min) {
                this.setState({ show_value: '', prv_value: '' })
                pp.onChange('', e);
            }

            if (pp.max != undefined && pp.max != null && pp.value.toString() != '' && pp.value > pp.max) {
                this.setState({ show_value: '', prv_value: this.state.prv_value })
                alert(`最大值不可超過${pp.max}!`);
                pp.onChange('', e);
            }
        }
        if (this.props.onBlur)
            this.props.onBlur(e)
    }
    //shouldComponentUpdate(nextProps: InputNumProps, nextState) {
    //    let pp = this.props;
    //    let st = this.state;
    //    if (pp.value != nextProps.value)
    //        return true;
    //    else
    //        return false
    //}
    render() {

        //console.log('InputNum','value check', this.state.show_value, this.props.value);
        //console.log('InputNum', 'inputViewMode check', this.props.inputViewMode, this.state.show_value);

        let out_html = null;
        let pp = this.props;

        let set_style: React.CSSProperties = null;
        if (this.props.style)
            set_style = this.props;
        else
            if (this.props.hidden)
                set_style = { display: 'none' };

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <input
                        id={pp.id}
                        type="text"
                        className={pp.inputClassName}
                        width={pp.width}
                        style={pp.style}
                        value={this.state.show_value}
                        onChange={this.onChange}
                        disabled={pp.disabled}
                        required={pp.required}
                        maxLength={pp.maxLength}
                        onBlur={this.onBlur}
                        onFocus={pp.onFocus}
                        tabIndex={pp.tabIndex}
                        data-group={pp.group}
                        title={pp.title}
                        data-for={pp.dataFor}
                        data-tip={pp.dataTip}
                        readOnly={pp.readyonly}
                    />
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html =
                (
                    <span
                        id={this.props.id}
                        className={this.props.viewClassName}>
                        {pp.moneyFmt ? fmtMoney(this.state.show_value) : this.state.show_value}
                    </span>
                );
        }
        return out_html;
    }
}

interface SelectTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    disabled?: boolean;
    onChange?: Function;
    value?: string | number;
    id?: string;
    options?: Array<SelectTextOptions>;
    required?: boolean;
    is_blank?: boolean;
    blank_text?: string;
    show_type?: SelectShowType;
    ref?: string | any;
    group?: string;
    is_int_type?: boolean;
}
export class SelectText extends React.Component<SelectTextProps, any>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        required: false,
        is_blank: false,
        blank_text: gb_Lang.option_blank,
        show_type: SelectShowType.label,
        is_int_type: false
    }
    refs: {
        [key: string]: (Element);
        select: any;
    }
    componentDidMount() {
        SetSelectEdge(this.refs.select);
    }

    componentDidUpdate(prevProps, prevState) {
        SetSelectEdge(this.refs.select);
    }

    onChange(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);

        if (value !== undefined && value !== null && this.props.is_int_type) {
            this.props.onChange(parseFloat(value), e);
        } else {
            this.props.onChange(value, e);
        }
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value.toString();
        if (this.props.inputViewMode == InputViewMode.edit) {

            let blank_option = this.props.is_blank ? <option value="">{this.props.blank_text}</option> : '';

            out_html =
                (
                    <select ref="select"
                        id={this.props.id}
                        className={this.props.inputClassName}
                        value={value}
                        onChange={this.onChange}
                        disabled={this.props.disabled}
                        required={this.props.required}
                        data-group={this.props.group}>
                        {blank_option}
                        {
                            this.props.options.map((item, i) => {
                                if (item.value == this.props.value) {
                                    return <option key={i} value={item.value} defaultValue={item.value}>{item.label}</option>
                                } else {
                                    return <option key={i} value={item.value}>{item.label}</option>
                                }
                            })
                        }
                    </select>
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            out_html = <span className={this.props.viewClassName} id={this.props.id}></span>; //無

            this.props.options.forEach((item, i) => {
                if (item.value == this.props.value) {
                    if (this.props.show_type == SelectShowType.label)
                        out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.label}</span>

                    if (this.props.show_type == SelectShowType.value)
                        out_html = <span id={this.props.id} className={this.props.viewClassName}>{item.value}</span>
                }
            })
        }
        return out_html;
    }
}

//TextArea
interface AreaTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    viewClassName?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    onChange?: Function;
    value?: string;
    rows?: number;
    cols?: number;
    id?: string;
    required?: boolean;
    isHtml?: boolean;
    ref?: string | any;
    defaultValue?: string;
    maxLength?: number;
    name?: string;
    placeholder?: string;
}
export class AreaText extends React.Component<AreaTextProps, any>{

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }
    static defaultProps = {
        disabled: false,
        isHtml: false,
        inputViewMode: InputViewMode.edit
    }
    onChange(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);
        this.props.onChange(value, e);
    }
    areaTextBr(val: string) {
        return val.replace(config.RegNewLineBR, "<br />");
    }
    render() {
        let out_html = null;
        let value = this.props.value == undefined ? '' : this.props.value;
        const pp = this.props;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (
                    <textarea
                        id={pp.id}
                        name={pp.name}
                        className={this.props.inputClassName}
                        onChange={this.onChange}
                        disabled={pp.disabled}
                        rows={pp.rows}
                        cols={pp.cols}
                        required={pp.required}
                        style={pp.style}
                        value={value}
                        defaultValue={pp.defaultValue}
                        maxLength={pp.maxLength}
                        placeholder={pp.placeholder}
                    ></textarea>
                );
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            if (this.props.isHtml) {
                out_html =
                    (
                        <span
                            id={this.props.id}
                            className={this.props.viewClassName}
                            dangerouslySetInnerHTML={{ __html: this.areaTextBr(value.toString()) }}>
                        </span>
                    );
            } else {
                out_html =
                    (
                        <span
                            id={this.props.id}
                            className={this.props.viewClassName}>
                            {value}
                        </span>
                    );
            }

        }
        return out_html;
    }
}

export const SetSelectEdge = (obj: any) => {

    if (!/Edge\/\d./i.test(navigator.userAgent)) {
        return;
    }
    //console.log('Edge');
    let selectedIndex = -1;
    if (obj) {
        selectedIndex = obj.selectedIndex;
    }

    if (selectedIndex >= 0) {
        const inputDOM = ReactDOM.findDOMNode(obj);

        let tempOption;
        if (inputDOM.childNodes.length === 1) {
            tempOption = document.createElement('option');
            inputDOM.appendChild(tempOption);
        }

        const options = obj.options;
        const tempIndex = (selectedIndex + 1) % options.length;
        options[tempIndex].selected = true;
        options[selectedIndex].selected = true;

        if (tempOption) {
            inputDOM.removeChild(tempOption);
        }
    }
}

//FileUp
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
}
interface FileUpBtnState {
    is_open?: boolean,
    files?: Array<SerializeFile>,
    cho_name?: string

    //limitcount?: number
    //limitsize?: number
    filescope?: ImageUpScope
}
export class FileUpBtn extends React.Component<FileUpBtnProps, FileUpBtnState>{

    options_file = null

    private up_path: string = gb_approot + 'FileHdl/Up';
    private ls_path: string = gb_approot + 'FileHdl/List';
    private de_path: string = gb_approot + 'FileHdl/Del';
    private dw_path: string = gb_approot + 'FileHdl/Down';
    //private cp_path: string = gb_approot + 'FileHdl/copyLastYear';
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.close = this.close.bind(this);
        this.listFile = this.listFile.bind(this);
        this.down = this.down.bind(this);
        this.delete = this.delete.bind(this);
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
        is_model: false
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
        //console.log('fileupload', 1)
        //檔案上傳參數設定
        this.options_file = {
            baseUrl: this.up_path,
            param: {
                _: (new Date()).getTime()
            },
            dataType: 'json',
            wrapperDisplay: 'block',
            multiple: false,
            numberLimit: 1,
            accept: accept,
            chooseAndUpload: false,
            paramAddToField: {
                key: pp.fileKey,
                id: pp.id,
            },
            fileFieldName: 'fileObject',
            withCredentials: false,
            //requestHeaders: { 'User-Agent': 'So Aanyip' },
            beforeChoose: function () {
                return true;
            },
            chooseFile: function (files) {
                //console.log('you choose', typeof files == 'string' ? files : files[0].name)
                var f = typeof files == 'string' ? files : files[0].name
                _self.setState({ cho_name: f });
                return f;
            },
            beforeUpload: function (files, mill) {
                //console.log('files', files);
                if (typeof files == 'string') return true

                //console.log('files size', files[0].size);
                if (files[0].size < 1024 * 1024 * 38) {
                    files[0].mill = mill
                    //console.log('files[0]', files[0], 'OK');
                    return true
                } else {
                    tosMessage('檔案上傳狀態', '檔案太大，需小於38MB!', ToastrType.error);
                }
                //console.log('files', 'No');
                return false
            },
            doUpload: function (files, mill) {
                //console.log('you just uploaded', typeof files == 'string' ? files : files[0].name)
            },
            uploading: function (progress) {
                //console.log('loading...', progress.loaded, progress.total, progress.loaded / progress.total + '%')
                var n = floatSpot(progress.loaded / progress.total * 100, 2);
                _self.setState({ cho_name: n + '%' })
            },
            uploadSuccess: function (resp: ResultBase) {

                if (resp.state == 0) {
                    _self.listFile();
                    tosMessage('檔案上傳狀態', '上傳完成', ToastrType.success);
                    if (_self.props.hub) {
                        //console.log(_this.props.hub)
                        _self.props.hub.server.getListFile();
                    }
                }
                else if (resp.state == 1)
                    tosMessage('檔案上傳狀態', '檔案容量超過限制，最大為' + formatFileSize(st.filescope.limitSize) + '。', ToastrType.error);
                else if (resp.state == 2)
                    tosMessage('檔案上傳狀態', '檔案數量超過限制:' + st.filescope.limitCount, ToastrType.error);
                else if (resp.state == 3)
                    tosMessage('檔案上傳狀態', '檔案類型不允許上傳。', ToastrType.error);
                else
                    tosMessage('檔案上傳狀態', resp.message, ToastrType.error);


            },
            uploadError: function (err) {
                alert('uploadError:' + err.message)
            },
            uploadFail: function (resp) {
                alert(resp)
            }
        }
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
                                                <FileUpload options={this.options_file}>
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
                                                </FileUpload>
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
                        (st.files.length < st.filescope.limitCount) ? <FileUpload options={this.options_file}>
                            <label ref="chooseBtn" className="align-middle">{this.state.cho_name}</label>
                            <button ref="uploadBtn" type="button" disabled={pp.disabled} className="btn warning sm oi" data-glyph="data-transfer-upload">檔案上傳</button>
                        </FileUpload> : null
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
            </div>;
        }


        return out_html;
    }
}

interface RadioTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;
    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    //onChange?: Function;
    onClick?: Function;
    value?: string | number;
    id?: string;
    required?: boolean;
    onFocus?: React.EventHandler<React.FocusEvent<EventTarget>>;
    ref?: string | any;
    tabIndex?: number;
    checked?: boolean;
    trueSign?: string;
    fasleSign?: string;
    name?: string;
}
export class RadioText extends React.Component<RadioTextProps, any>{

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        checked: false,
        trueSign: '',
        fasleSign: ''
    }
    onClick(e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let value = makeInputValue(e);
        this.props.onClick(value, e);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let value = pp.value == undefined ? '' : pp.value;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (<input
                    id={pp.id}
                    type="radio"
                    name={pp.name}
                    className={pp.inputClassName}
                    style={pp.style}
                    value={value}
                    //onChange={this.onChange}
                    onClick={this.onClick}
                    disabled={pp.disabled}
                    required={pp.required}
                    onFocus={pp.onFocus}
                    tabIndex={pp.tabIndex}
                    checked={pp.checked}
                />);
        }

        if (this.props.inputViewMode == InputViewMode.view) {
            if (pp.checked) {
                out_html =
                    (
                        <span
                            id={pp.id}
                            className={pp.viewClassName}>
                            {pp.trueSign}
                        </span>
                    );
            } else {
                out_html =
                    (
                        <span
                            id={pp.id}
                            className={pp.viewClassName}>
                            {pp.fasleSign}
                        </span>
                    );
            }
        }
        return out_html;
    }
}

interface CheckTextProps {
    inputViewMode?: InputViewMode
    inputClassName?: string;

    width?: string;
    style?: React.CSSProperties;
    viewClassName?: string;
    disabled?: boolean;
    onClick?: Function;
    value?: string | number | boolean;
    id?: string;
    required?: boolean;
    onFocus?: React.EventHandler<React.FocusEvent<EventTarget>>;
    ref?: string | any;
    tabIndex?: number;
    checked?: boolean;
    trueSign?: string;
    fasleSign?: string;
    viewShowCheck?: boolean; //
    dataFor?: string;
    dataTip?: string;
}
export class CheckText extends React.Component<CheckTextProps, any>{

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    static defaultProps = {
        disabled: false,
        inputViewMode: InputViewMode.edit,
        checked: false,
        trueSign: '',
        fasleSign: '',
        viewShowFalse: false
    }

    onClick(e: React.SyntheticEvent<EventTarget>) {
        //let input: HTMLInputElement = e.target as HTMLInputElement;
        //let value = makeInputValue(e);
        //console.log('click', '=>', this.props.checked);
        this.props.onClick(!this.props.checked, e);
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let value: any = this.props.value == undefined ? '' : this.props.value;

        if (this.props.inputViewMode == InputViewMode.edit) {
            out_html =
                (<input
                    id={this.props.id}
                    type="checkbox"
                    className={pp.inputClassName}
                    style={pp.style}
                    value={value}
                    onClick={this.onClick}
                    disabled={pp.disabled}
                    required={pp.required}
                    onFocus={pp.onFocus}
                    tabIndex={pp.tabIndex}
                    checked={pp.checked}
                    data-for={pp.dataFor}
                    data-tip={pp.dataTip}
                />);
        }

        if (this.props.inputViewMode == InputViewMode.view) {

            if (!this.props.viewShowCheck)
                return <span></span>;

            if (this.props.checked) {
                out_html =
                    (
                        <span
                            id={this.props.id}
                            className={this.props.viewClassName}>
                            {this.props.trueSign}
                        </span>
                    );
            }
            else {
                out_html =
                    (
                        <span
                            id={this.props.id}
                            className={this.props.viewClassName}>
                            {this.props.fasleSign}
                        </span>
                    );
            }
        }
        return out_html;
    }
}

//PW_Button
interface PWButtonProps {
    inputClassName?: string;
    title?: string;
    onClick?: React.EventHandler<React.MouseEvent<EventTarget>>;
    id?: string;
    className?: string;
    dataGlyph?: string
    enable?: boolean;
    type?: 'submit' | 'reset' | 'button';
    style?: React.CSSProperties;
    hidden?: boolean;
    name?: string;
    dataFor?: string;
    dataTip?: boolean;
    roles?: string[];
    role?: string;
}
export class PWButton extends React.Component<PWButtonProps, any>{

    constructor(props) {
        super(props);
    }
    static defaultProps = {
        enable: true,
        type: 'button',
        hidden: false,
        roles: [],
        role: null
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let set_style: React.CSSProperties = null;
        if (pp.style)
            set_style = pp.style;
        else
            if (this.props.hidden)
                set_style = { display: 'none' };

        let enabled = true;

        enabled = enabled && pp.enable;
        out_html =
            (
                <button type={pp.type}
                    title={pp.title}
                    name={pp.name}
                    className={pp.className}
                    onClick={pp.onClick}
                    disabled={!enabled}
                    id={pp.id}
                    style={set_style}
                    data-for={pp.dataFor}
                    data-tip={pp.dataTip}
                    data-glyph={pp.dataGlyph}>
                    {pp.children}
                </button>
            );
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

//floor元件
interface PageFooterProps {
    page_grid?: GridInfo<any>,
    callPage: Function
}
export class PageFooter extends React.Component<PageFooterProps, any>{

    constructor(props) {
        super(props);
        this.clkFirstPage = this.clkFirstPage.bind(this);
        this.clkPrvePage = this.clkPrvePage.bind(this);
        this.clkNextPage = this.clkNextPage.bind(this);
        this.clkLastPage = this.clkLastPage.bind(this);
        this.clkJumpPage = this.clkJumpPage.bind(this);
        this.state = {
        };
    }
    clkLastPage(e) {
        let page = this.props.page_grid.total
        this.props.callPage(page);
    }
    clkNextPage(e) {
        let page = this.props.page_grid.page + 1;
        this.props.callPage(page);
    }
    clkPrvePage(e) {
        let page = this.props.page_grid.page - 1;
        this.props.callPage(page);
    }
    clkFirstPage(e) {
        this.props.callPage(1);
    }
    clkJumpPage(e) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        this.props.callPage(input.value);
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;

        out_html = <footer className="table-foot">
            <small className="pull-right">
                {'gb_Lang.pageTpl(pp.page_grid.startcount, pp.page_grid.endcount, pp.page_grid.records)'}
            </small>
            <nav className="pager">
                <button type="button" className="oi" data-glyph="media-step-backward" title="到最前頁" onClick={this.clkFirstPage} disabled={pp.page_grid.page <= 1} />
                <button type="button" className="oi" data-glyph="chevron-left" title="上一頁" onClick={this.clkPrvePage} disabled={pp.page_grid.page <= 1} />
                <span>
                    第
                        <input className="text-center" type="number" value={pp.page_grid.page} onChange={this.clkJumpPage} />
                    頁，共 {pp.page_grid.total}頁
                            </span>
                <button type="button" className="oi" title="下一頁" data-glyph="chevron-right" onClick={this.clkNextPage} disabled={pp.page_grid.page >= pp.page_grid.total} />
                <button type="button" className="oi" title="到最後頁" data-glyph="media-step-forward" onClick={this.clkLastPage} disabled={pp.page_grid.page >= pp.page_grid.total} />
            </nav>
        </footer>;
        return out_html;
    }
}