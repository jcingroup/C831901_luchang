import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';
import { jquery } from 'jquery'
import CKEditor from 'ckeditor4-react';

export class NewsDataEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AUTHOR: '',
            TITLE: '',
            CONTENT: '',
            SORT: '1',
            DISABLED: 'false',
            STATUS: true
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);

    }

    onEditorChange(evt) {
        this.setState({
            CONTENT: evt.editor.getData()
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

    postForm() {

        let htp = new HttpProcess();

        let postData = this.state;

        let promise = htp.fetchSendPost(htp.getApisPath().SAVE_DATA, postData);

        promise.then((jsonData) => {
            if (jsonData.success) {
                if (jsonData.url != '') {
                    window.location.href = jsonData.url;
                }
                else {
                    window.location.reload();
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

    getData() {
        let htp = new HttpProcess();
        let promise = htp.fetchSendGet(htp.getApisPath().GET_DATA);

        promise.then((jsonData) => {
            if (jsonData.success) {

                this.setState({
                    listData: jsonData.data
                });
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
        let AUTHOR = state.AUTHOR;
        let TITLE = state.TITLE;
        let SORT = state.SORT;
        let DISABLED = state.DISABLED;
        let STATUS = state.STATUS;
        let CONTENT = state.CONTENT;
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
                                <input type="checkbox" name="STATUS" checked={STATUS == true} onChange={(e) => this.handleInputChange(e)} />
                                <div class="slider round"></div>
                            </label>
                        </dd>
                    </dl>
                    <fieldset class="mb-20">
                        <legend class="underline">[ 文章內容 ]</legend>
                        <aside class="panel-warning mb-s">
                            <strong>編輯器注意事項:</strong>
                            <ol class="pl-l font-tiny my-s">
                                <li>從 WORD 複製文字時，請使用下方的<img src="~/Content/images/_SysAdm/icon-word.jpg" /> 圖示來貼上 WORD 文字，避免跑版</li>
                                <li>編輯器上傳圖片或新增表格等時，請勿設定<u>寬度及高度</u>(將數字刪除) ，以免行動裝置顯示時會跑版。</li>
                                <li>檔案尺寸寬度超過 1600 或 高度超過1200 的圖片會被壓縮(PNG透明背景會變成不透明)</li>
                            </ol>
                        </aside>
                        {/* <textarea name="CONTENT" rows="25" class="form-element full" onChange={(e) => this.handleInputChange(e)}>{CONTENT}</textarea> */}
                        <CKEditor
                            onChange={(e) => this.onEditorChange(e)}
                            data={CONTENT}
                        />
                    </fieldset>
                    <footer class="submit-bar fixed-bottom">
                        <button type="button" class="btn success oi" data-glyph="circle-check" onClick={() => this.postForm()}>確定儲存</button>
                        <button type="button" class="btn cancel oi" data-glyph="circle-x">取消</button>
                    </footer>
                </form>
            </div>
        );
    }
}


