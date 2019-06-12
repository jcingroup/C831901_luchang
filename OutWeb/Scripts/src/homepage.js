import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';

export class NewsListDataHome extends Component {
    constructor(props) {
        super(props);
        let filter = {
            page: 1,
            field: '',
            sort: '',
            qry: '',
            disabled: '',
            mode: 'home'
        };
        this.state = {
            listData: null,
            page: null,
            filter
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.renderEditPage = this.renderEditPage.bind(this);
        this.getData = this.getData.bind(this);
        this.renderEditPage = this.renderEditPage.bind(this);

    }

    componentDidMount() {
        this.getData();
    }

    renderEditPage(e, id) {
        e.preventDefault();
        window.location.href = '/Special/Details?id=' + id;
    }

    getData() {
        let htp = new HttpProcess();
        let postData = this.state.filter;
        Object.keys(postData).forEach(function (key) {
            let v = postData[key];
            if (v == null) {
                postData[key] = '';
            }
        });

        let promise = htp.fetchSendGet(htp.getApisPath().GET_FRONT_LIST, postData);
        promise.then((jsonData) => {
            if (jsonData.success) {
                this.setState({
                    listData: jsonData.data,
                    page: jsonData.page,
                    filter: jsonData.filter
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
        let data = this.state.listData;
        if (data) {
            return (
                <div>
                    {
                        data.map((item, i) => {
                            return (
                                <article class="col-sm-6 col-lg-4 article" onClick={(e) => this.renderEditPage(e, item.ID)} >
                                    <h3>{item.TITLE}</h3>
                                    <p>{item.CONTENT}</p>
                                    <a href="javasciprt:void(0)" onClick={(e) => this.renderEditPage(e, item.ID)} class="font-sm text-white more">READ MORE</a>
                                </article>
                            )
                        })
                    }
                </div>
            )
        }
        return <div></div>;
    }
}
ReactDOM.render(<NewsListDataHome />, document.getElementById('list_view'));