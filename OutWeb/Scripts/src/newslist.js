import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';
import { Aside,Nav, Header, Table, Footer } from './components'


class NewsListData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: null
            // details: null
        }
    }

    componentDidMount() {
        this.getData();
    }
    renderEditPage(id) {
    window.location.href ='/_SysAdm/Edit?id=' + id;
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
        let promise = htp.fetchSendGet(htp.getApisPath().GET_LIST);

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
        return (
            <div>
                <Aside />
                <Nav />
                <Header />
                <Table vm={this.state.listData} renderEditPage={(id) => this.renderEditPage(id)} />
                <Footer />
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