import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';
import { Aside, Nav, Header, Table, Footer } from './components'


class NewsListData extends Component {
    constructor(props) {
        super(props);
        let filter = {
            page: 1,
            field: '',
            sort: '',
            qry: '',
            disabled:''
        };
        this.state = {
            listData: null,
            page: null,
            filter
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.renderEditPage = this.renderEditPage.bind(this);
        this.removeData = this.removeData.bind(this);
        this.getData = this.getData.bind(this);
        this.conditionGetData = this.conditionGetData.bind(this);
    }

    componentDidMount() {
        this.getData();
    }
    renderEditPage(id) {
        window.location.href = '/_SysAdm/Edit?id=' + id;
    }

    removeData(id) {
        let confrimChk = confirm('確定要刪除資料?');
        if (!confrimChk)
            return;

        let htp = new HttpProcess();
        let postData = { id };
        let promise = htp.fetchSendPost(htp.getApisPath().REMOVE_DATA, postData);

        promise.then((jsonData) => {
            if (jsonData.success) {
                window.location.reload();
            }
            else {
                alert(jsonData.msg);
            }
        })
            .catch((err) => {
                console.log('錯誤:', err);
            });
    }

    //ajax
    // componentDidMount() {
    //     let self = this;
    //     let htp = new HttpProcess();
    //     $.ajax({
    //         type: 'GET',
    //         url: htp.getApisPath().GET_LIST,
    //         dataType: "json",
    //         success: function (response) {
    //             if (!response.success) {
    //                 alert(response.msg);
    //                 return;
    //             }
    //             else {
    //                 self.setState({
    //                     listData: response.data
    //                 });
    //             }
    //         }
    //         , error: function (err) {
    //             alert('error');
    //             console.log(err);
    //         }
    //             .bind(this)
    //     });
    // }

    getData() {
        let htp = new HttpProcess();
        let postData = this.state.filter;
        Object.keys(postData).forEach(function (key) {
            let v = postData[key];
            if (v == null) {
                postData[key] = '';
            }
        });

        let promise = htp.fetchSendGet(htp.getApisPath().GET_LIST, postData);
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

    conditionGetData() {
        this.getData();
    }

    render() {
        return (
            <div>
                <Aside />
                <Nav />
                <Header filter={this.state.filter} conditionGetData={() => this.conditionGetData()}/>
                <Table vm={this.state.listData} filter={this.state.filter} conditionGetData={() => this.conditionGetData()} renderEditPage={(id) => this.renderEditPage(id)} removeData={(id) => this.removeData(id)} />
                <Footer page={this.state.page} filter={this.state.filter} conditionGetData={() => this.conditionGetData()} />
            </div>
        );
        // if (this.state.details) {
        //     alert(0);
        //     // console.log(this.state.details);
        //     // return <NewsDataEdit />
        //     // ReactDOM.render(<NewsDataEdit />, document.getElementById('page_content'));
        // }
        // else {
        //     return (
        //         <div>
        //             <Aside />
        //             <Nav />
        //             <Header />
        //             <Table vm={this.state.listData} renderEditPage={(id) => this.renderEditPage(id)} />
        //             <Footer />
        //         </div>
        //     );
        // }

    }
}


ReactDOM.render(<NewsListData />, document.getElementById('list_view'));