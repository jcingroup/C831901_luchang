import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';
import 'babel-polyfill';
// import CKEditor from 'ckeditor4-react';
//查詢QueryString
export function queryString(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
export class NewsDataEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AUTHOR: '',
            TITLE: '',
            CONTENT: '',
            SORT: '1',
            DISABLED: 'false',
            STATUS: true,
            ID: null
        };
        this.componentDidMount = this.componentDidMount.bind(this);
        // this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.renderEditPage = this.renderEditPage.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
        this.cancelHandleClick = this.cancelHandleClick.bind(this);

        let id = queryString('id', null);
        if (id !== null) {
            this.renderEditPage(id);
        }
    }


    componentDidMount() {
        CKFinder.setupCKEditor(null, { basePath: '/ckfinder/', skin: 'v1' });
        CKEDITOR.replace('news_content', { custom: '../ckeditor/config.js?v2=' });
    }

    // componentWillReceiveProps(nextProps) {
    //     alert('componentWillReceiveProps trigger');
    //     if (this.props.edit_type == IEditType.none && (nextProps.edit_Type == IEditType.insert || nextProps.edit_type == IEditType.modify)) {
    //         CKEDITOR.instances['news_content'].setData(nextProps.field.news_content);
    //     }
    // }

    requiredField(data) {
        let validSuccess = true;
        let valid = {
            AUTHOR: true,
            TITLE: true
        };
        Object.keys(data).forEach(function (item) {
            let fieldCht;
            switch (item) {
                case "AUTHOR":
                    fieldCht = "作者";
                    break;
                case "TITLE":
                    fieldCht = "標題";
                    break;
            }
            let isRequired = valid[item];
            if (isRequired && !data[item]) {
                alert(`${fieldCht}為必填!`);
                validSuccess = false;
                return;
            }
            else if (isRequired && data[item].trim() === '') {
                alert(`${fieldCht}為必填!`);
            }
        });
        return validSuccess;
    }


    onEditorChange(evt) {
        this.setState({
            CONTENT: evt.editor.getData()
        });
    }

    renderEditPage(id) {
        let htp = new HttpProcess();
        let postData = { id };

        let promise = htp.fetchSendGet(htp.getApisPath().GET_DATA, postData);

        promise.then((jsonData) => {
            let data = jsonData.data;
            if (jsonData.success) {
                this.setState({
                    AUTHOR: data.AUTHOR,
                    TITLE: data.TITLE,
                    CONTENT: data.CONTENT,
                    SORT: data.SORT,
                    DISABLED: data.DISABLED,
                    STATUS: data.STATUS,
                    ID: data.ID
                });
                CKEDITOR.instances['news_content'].setData(data.CONTENT);
            }
            else {
                alert(jsonData.msg);
            }
        })
            .catch((err) => {
                console.log('錯誤:', err);
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    cancelHandleClick(e) {
        e.preventDefault();
        window.location.href = '/_SysAdm/List';
    };
    postForm(id) {
        let content = CKEDITOR.instances["news_content"].getData();
        let htp = new HttpProcess();
        let postData = this.state;
        postData.CONTENT = content;

        let isValid = this.requiredField(postData);
        if (!isValid) {
            return;
        }

        postData.id = id;
        let promise = htp.fetchSendPost(htp.getApisPath().SAVE_DATA, postData);

        promise.then((jsonData) => {
            if (jsonData.success) {
                if (jsonData.url !== '') {
                    window.location.href = jsonData.url;
                }

            }
            else {
                alert(jsonData.msg);
            }
        })
            .catch((err) => {
                console.log('錯誤:', err);
            });

    }

    render() {
        let state = this.state;
        let id = this.state.ID;
        let AUTHOR = state.AUTHOR;
        let TITLE = state.TITLE;
        let SORT = state.SORT;
        let DISABLED = state.DISABLED.toString().toLowerCase();
        let STATUS = state.STATUS;
        let CONTENT = state.CONTENT;
        if (this.state) {
            return (
                <div>
                    <form>

                        <dl class="row padding">
                            <dt class="col-2 text-right label">
                                <sup class="help" title="必填">*</sup>
                                標題
                             </dt>
                            <dd class="col-8">
                                <input type="text" name="TITLE" class="form-element full" value={TITLE} required onChange={(e) => this.handleInputChange(e)} />
                            </dd>
                        </dl>
                        <dl class="row padding">
                            <dt class="col-2 text-right label">
                                <sup class="help" title="必填">*</sup>
                                作者
            </dt>
                            <dd class="col-4">
                                <input type="text" name="AUTHOR" class="form-element full" value={AUTHOR} required onChange={(e) => this.handleInputChange(e)} />
                            </dd>
                        </dl>
                        <dl class="row padding">
                            <dt class="col-2 text-right label">
                                排序
            </dt>
                            <dd class="col-8">
                                <input type="number" name="SORT" class="form-element" value={SORT} onChange={(e) => this.handleInputChange(e)} />
                                <small class="text-danger">* 無值或數字相同時以新增時間愈近愈前面，若給值時則數字愈大愈前面。</small>
                            </dd>
                        </dl>
                        <dl class="row padding">
                            <dt class="col-2 text-right label">
                                狀態
            </dt>
                            <dd class="col-6">
                                <label class="control-group">
                                    <input class="radio" type="radio" name="DISABLED" value="false" checked={DISABLED === 'false'} onChange={(e) => this.handleInputChange(e)} />
                                    <i class="icon"></i> 上架
                                </label>
                                <label class="control-group">
                                    <input class="radio" type="radio" name="DISABLED" value="true" checked={DISABLED === 'true'} onChange={(e) => this.handleInputChange(e)} />
                                    <i class="icon"></i> 下架
                                </label>
                            </dd>
                        </dl>
                        <dl class="row padding">
                            <dt class="col-2 text-right label">
                                顯示於首頁
            </dt>
                            <dd class="col-6">
                                <label class="switch">
                                    <input type="checkbox" name="STATUS" checked={STATUS === true} onChange={(e) => this.handleInputChange(e)} />
                                    <div class="slider round"></div>
                                </label>
                            </dd>
                        </dl>
                        <fieldset class="mb-20">
                            <legend class="underline">[ 文章內容 ]</legend>
                            <aside class="panel-warning mb-s">
                                <strong>編輯器注意事項:</strong>
                                <ol class="pl-l font-tiny my-s">
                                    <li>從 WORD 複製文字時，請使用下方的<img src="/Content/images/_SysAdm/icon-word.jpg" /> 圖示來貼上 WORD 文字，避免跑版</li>
                                    <li>編輯器上傳圖片或新增表格等時，請勿設定<u>寬度及高度</u>(將數字刪除) ，以免行動裝置顯示時會跑版。</li>
                                    <li>檔案尺寸寬度超過 1600 或 高度超過1200 的圖片會被壓縮(PNG透明背景會變成不透明)</li>
                                </ol>
                            </aside>
                            <textarea id="news_content" name="news_content" rows="25" class="form-element full" onChange={(e) => this.handleInputChange(e)}></textarea>
                            {/* <CKEditor
                                onChange={(e) => this.onEditorChange(e)}
                                data={CONTENT}
                            /> */}
                        </fieldset>
                        <footer class="submit-bar fixed-bottom">
                            <button type="button" class="btn success oi" data-glyph="circle-check" onClick={() => this.postForm(this.id)}>確定儲存</button>
                            <button type="button" class="btn cancel oi" data-glyph="circle-x" onClick={(e) => this.cancelHandleClick(e)}>取消</button>
                        </footer>
                    </form>
                </div>
            );
        }
        return (<div></div>);

    }
}

    ReactDOM.render(<NewsDataEdit />, document.getElementById('page_content'));


