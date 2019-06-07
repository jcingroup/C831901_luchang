import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { HttpProcess } from './httpunity';

export class ChangePw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oPw: '',
            nPw: '',
            reNpw: ''
        };
        this.cancelHandleClick =this.cancelHandleClick.bind(this);
        this.handleInputChange =this.handleInputChange.bind(this);
        this.postData =this.postData.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    postData() {
        let validMap = {
            oPw: '舊密碼',
            nPw: '新密碼',
            reNpw: '確認新密碼'
        };
        let htp = new HttpProcess();

        let postData = this.state;
        let validRequired =true;

        Object.keys(postData).forEach(function (key) {
            let v = postData[key];
            if (v == null || v.trim() == '') {
                alert("請輸入" + validMap[key]);
                validRequired=false;
                return;
            }
        });

        if(!validRequired)
        return;

        let promise = htp.fetchSendPost(htp.getApisPath().CHANGE_PW, postData);
        promise.then((jsonData) => {
            if (jsonData.success) {
                alert(jsonData.msg);
                window.location.href = jsonData.url;
            }
            else {
                alert(jsonData.msg);
            }
        })
            .catch((err) => {
                console.log('錯誤:', err);
            });
    }

    cancelHandleClick(e) {
        e.preventDefault();
        window.location.href = '/_SysAdm/List';
    };

    render() {
        return (
            <form>
                <dl class="row padding">
                    <dt class="col-2 text-right label">
                        <sup class="help" title="必填">*</sup>
                        舊密碼
                </dt>
                    <dd class="col-7">
                        <input type="password" name="oPw" class="form-element full" required onChange={(e) => this.handleInputChange(e)} />
                    </dd>
                </dl>
                <dl class="row padding">
                    <dt class="col-2 text-right label">
                        <sup class="help" title="必填">*</sup>
                        新密碼
                </dt>
                    <dd class="col-7">
                        <input type="password" name="nPw" class="form-element full" required onChange={(e) => this.handleInputChange(e)} />
                    </dd>
                </dl>
                <dl class="row padding">
                    <dt class="col-2 text-right label">
                        <sup class="help" title="必填">*</sup>
                        再次輸入新密碼
                </dt>
                    <dd class="col-7">
                        <input type="password" name="reNpw" class="form-element full" required onChange={(e) => this.handleInputChange(e)} />
                    </dd>
                </dl>

                <footer class="submit-bar">
                    <button type="button" class="btn success oi offset-sm-2" data-glyph="circle-check" onClick={() => this.postData()}>確定儲存</button>
                    <button type="button" class="btn cancel oi" data-glyph="circle-x" onClick={(e) => this.cancelHandleClick(e)}>取消</button>
                </footer>
            </form>

        )
    }
}
ReactDOM.render(<ChangePw />, document.getElementById('page_content'));
