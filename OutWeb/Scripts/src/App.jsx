import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';
import { Captcha } from 'reactjs-captcha';
import { captchaSettings } from 'reactjs-captcha';
import axios from 'axios'

class LoginFormInput extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            id: '',
            pwd: ''
        };
    }
    postForm(props) {
        this.props.postForm(props);
    }

    captchaOnSubmitHandler(e, state) {
        let validEmpty = !!(state.id && state.pwd);

        if (!validEmpty) {
            alert("請輸入帳號或密碼");
            return;
        }

        // the user-entered captcha code value to be validated at the backend side 
        let userEnteredCaptchaCode = this.captcha.getUserEnteredCaptchaCode();

        if (userEnteredCaptchaCode == "" || userEnteredCaptchaCode.toString().trim() == "") {
            alert("請輸入驗證碼");
            return;
        }

        // the id of a captcha instance that the user tried to solve 
        let captchaId = this.captcha.getCaptchaId();

        let postData = Object.assign({}, state, {
            userEnteredCaptchaCode: userEnteredCaptchaCode,
            captchaId: captchaId
        });

        let self = this;
        let htp = new HttpProcess();

        let promise = htp.fetchSendPost(htp.getApisPath().LOGIN, postData);

        promise.then((jsonData) => {
            console.log(jsonData);
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
                self.captcha.reloadImage();
            }
        })
            .catch((err) => {
                console.log('錯誤:', err);
            });

        event.preventDefault();
    }

    onInputChange(e) {
        let type = e.target.type;
        let val = e.target.value;
        let objProp = null;
        switch (type) {
            case "text":
                this.setState({
                    id: val
                })
                /*
                Object.assign({}, this.state, {
                id: val
                });
                */
                break;
            case "password":
                this.setState({
                    pwd: val
                })
                /*
                Object.assign({}, this.state.lid, {
                pwd: val
                });
                */
                break;
            default:
                break;
        }
    }



    render() {
        let state = this.state;
        let pId = state.id;
        let pPw = state.pwd;

        return (
            <div>
                <h2 class="title text-left text-primary">System Login</h2>
                <main class="text-left">

                    <label class="label">帳號 Username</label>
                    <input class="form-element" name="id" type="text" required value={pId} onChange={e => this.onInputChange(e)} />

                    <label class="label">密碼 Password</label>
                    <input class="form-element" name="pwd" type="password" required value={pPw} onChange={e => this.onInputChange(e)} />

                    <Captcha captchaStyleName="AncientMosaic"
                        ref={(captcha) => { this.captcha = captcha }} />
                    <label class="label">驗證碼 Code</label>
                    <input class="form-element" id="ca" type="text" required />

                </main>

                <footer class="action-bar" id="footer">
                    <button type="button" class="btn" onClick={(e) => this.captchaOnSubmitHandler(e, state)}>登入 LOGIN</button>
                </footer>
            </div>
        );
    }
}

class LogoinForm extends Component {
    constructor() {
        super();
        let valid = { id: '', pwd: '' };
        this.state = {
            valid
        };
    }



    render() {
        return (
            <div>
                <LoginFormInput valid={this.state.valid} />
            </div>
        );
    }
}

captchaSettings.set({
    captchaEndpoint:
        '/simple-captcha-endpoint.ashx'
});

ReactDOM.render(<LogoinForm />, document.getElementById('root'));