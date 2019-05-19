import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {HttpProcess} from './httpunity'

class LoginFormInput extends Component {
    constructor(prop) {
        super(prop);
        this.state = {
            id: '',
            pwd: ''
        }
    }
    postForm(props) {
        this.props.postForm(props)
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
                    <input class="form-element" type="text" required value={pId} onChange={e => this.onInputChange(e)} />

                    <label class="label">密碼 Password</label>
                    <input class="form-element" type="password" required value={pPw} onChange={e => this.onInputChange(e)} />

                </main>

                <footer class="action-bar" id="footer">
                    <button type="button" class="btn" onClick={() => this.postForm(state)}>登入 LOGIN</button>
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

    postForm(valid) {
            let validEmpty = !!(valid.id && valid.pwd);

            if(!validEmpty){
                alert("請輸入帳號或密碼");
                return;
            }

            let htp = new HttpProcess();
            console.log(htp.getApi().LOGIN);
            htp.fetchSendPost(htp.getApi().LOGIN,valid);

    }


    render() {
        return (
            <div>
                <LoginFormInput valid={this.state.valid} postForm={v => this.postForm(v)} />
            </div>
        );
    }
}


ReactDOM.render(<LogoinForm />, document.getElementById('root'));