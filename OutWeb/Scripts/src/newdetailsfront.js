import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';
import renderHTML from 'react-render-html';


export class NewsFrontData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AUTHOR: '',
            TITLE: '',
            CONTENT: '',
            SORT: '1',
            DISABLED: 'false',
            STATUS: true,
            ID: null,
            UPD_DT_STR: null
        };
        this.renderEditPage = this.renderEditPage.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
        this.cancelHandleClick = this.cancelHandleClick.bind(this);
        var url = new URL(document.URL);
        var id = url.searchParams.get("id");

        if (id != null) {
            this.renderEditPage(id);
        }
    }


    requiredField(data) {
        let validSuccess = true;
        let valid = {
            AUTHOR: true,
            TITLE: true
        };
        Object.keys(data).forEach(function (item) {
            let fieldCht;
            switch(item)
            {
                case"AUTHOR":
                fieldCht = "作者";
                break;
                case"TITLE":
                fieldCht = "標題";
                break;
            }
            let isRequired = valid[item];
            if (isRequired && !data[item]) {
                alert(`${fieldCht}為必填!`);
                validSuccess = false;
                return;
            }
            else if(isRequired && data[item].trim() == ''){
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

        let promise = htp.fetchSendGet(htp.getApisPath().GET_FRONT_DATA, postData);

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
                    ID: data.ID,
                    UPD_DT_STR:data.UPD_DT_STR
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
   

    render() {
        let state = this.state;
        let id = this.state.ID;
        let AUTHOR = state.AUTHOR;
        let TITLE = state.TITLE;
        let SORT = state.SORT;
        let DISABLED = state.DISABLED.toString().toLowerCase();
        let STATUS = state.STATUS;
        let CONTENT = state.CONTENT;
        let UPDATE_DT =state.UPD_DT_STR;
        return (
            <article class="wrap mt-xl">
            <h3 class="header">{TITLE}</h3>
            <h4 class="author">{AUTHOR} <small class="date">{UPDATE_DT} update</small></h4>
            <div class="editor pt-m pb-xl">
                <p>{renderHTML(CONTENT)}</p>
            </div>
        </article>
        );
    }
}


ReactDOM.render(<NewsFrontData />, document.getElementById('page_content'));
