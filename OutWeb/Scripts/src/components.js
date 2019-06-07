import React, { Component } from 'react';


export class Aside extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <aside class="panel-warning mb-m">
                <strong>排序：</strong>無值或數字相同時以新增時間愈近愈前面，若給值時則數字愈大愈前面。
        </aside>
        )
    }
}

export class Nav extends Component {
    constructor(props) {
        super(props);
        this.redirectAddPage = this.redirectAddPage.bind(this);
    }

    redirectAddPage() {
        window.location.href = "/_SysAdm/Add";
    }

    render() {

        return (
            <nav class="btn-group mb-10">
                <button type="button" class="btn success oi" data-glyph="plus" onClick={this.redirectAddPage}> 新增</button>
            </nav>
        )
    }
}

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qry: '',
            status: null
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.conditionGetData = this.conditionGetData.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });

        if (target.type === 'select-one') {
            this.props.filter.disabled = value;
        }
        else {
            this.props.filter.qry = value;
        }

    }
    conditionGetData() {
        this.props.conditionGetData();
    }

    render() {

        return (
            <header class="table-head">
                <label class="label">狀態</label>
                <select class="form-element" name="disabled" onChange={(e) => this.handleInputChange(e)}>
                    <option hidden>請選擇</option>
                    <option value="A">全部</option>
                    <option value="Y">上架</option>
                    <option value="N">下架</option>
                </select>
                <input type="text" class="form-element" placeholder="請輸入關鍵字" name="qry" value={this.state.qry} onChange={(e) => this.handleInputChange(e)} />
                <button type="button" class="btn oi" data-glyph="magnifying-glass" onClick={() => this.conditionGetData()} >搜尋</button>
            </header>
        )
    }
}


export class Table extends Component {
    constructor(props) {
        super(props);

        this.renderEditPage = this.renderEditPage.bind(this);
        this.conditionGetData = this.conditionGetData.bind(this);
    }

    renderEditPage(id) {
        this.props.renderEditPage(id);
    }
    removeData(id) {
        this.props.removeData(id);
    }

    conditionGetData(event) {
        const target = event.target;
        const value = target.type === 'button' ? target.checked : target.value;
        const field = target.id;
        const sort = target.getAttribute("sort-type");
        let sortClum = sort == 'asc' ? 'desc' : 'asc';
        this.props.filter.field = field;
        this.props.filter.sort = sort == '' ? 'asc' : sort == 'asc' ? 'desc' : 'asc';
        this.props.conditionGetData();
    }



    render() {
        if (this.props.vm) {
            return (
                <table class="table-list table-hover table-striped">
                    <colgroup>
                        <col span="2" />
                        <col style={{ width: '40%' }} />
                        <col span="2" style={{ width: '140px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th class="item-edit">修改</th>
                            <th>新增時間</th>
                            <th class="text-left">標題</th>
                            <th><button type="button" onClick={(e) => this.conditionGetData(e)} id="DISABLED" sort-type={this.props.filter.field === "DISABLED" ? this.props.filter.sort : ""}
                                class={`th-sort-toggle ${this.props.filter.field === "DISABLED" ? this.props.filter.sort : ''}`}>上架狀態</button></th>
                            <th><button type="button" onClick={(e) => this.conditionGetData(e)} id="STATUS" sort-type={this.props.filter.field === "STATUS" ? this.props.filter.sort : ""}
                                class={`th-sort-toggle ${this.props.filter.field === "STATUS" ? this.props.filter.sort : ''}`}>顯示</button></th>
                            <th class="text-left">修改時間</th>
                            <th class="item-edit">刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.vm.map((item, i) => {
                                let disabledDesc = item.DISABLED ? '下架' : '上架';
                                let statusDesc = item.STATUS ? '顯示' : '隱藏';

                                return (
                                    <tr key={'row-' + i}>
                                        <td>
                                            <button class="hover-primary oi" title="修改" data-glyph="pencil" type="button" onClick={() => this.renderEditPage(item.ID)}></button>
                                        </td>
                                        <td>{item.BUD_DT_STR}</td>
                                        <td class="text-left">{item.TITLE}</td>
                                        <td><span class="label-success" class={`label-${item.DISABLED ? 'danger' : 'success'}`}>{disabledDesc}</span></td>
                                        <td>{statusDesc}</td>
                                        <td class="text-left">{item.UPD_DT_STR}</td>
                                        <td><button class="hover-danger oi" title="刪除" type="button" data-glyph="trash" onClick={() => this.removeData(item.ID)}>刪除</button></td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            )
        }
        return <div>資料處理中...</div>;
    }
}


export class Footer extends Component {
    constructor(prop) {
        super(prop);

        this.state = {
            page: 1
        };
        this.conditionGetData = this.conditionGetData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    conditionGetData(page) {
        this.props.filter.page = page <= 0 ? 1 : page;
        this.props.conditionGetData();
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
        this.props.filter.page = value;
        this.conditionGetData(value);
    }

    render() {
        if (this.props.page) {

            let pageInfo = this.props.page;
            return (
                <footer class="table-foot">
                    <small class="pull-right">{`第 ${pageInfo.page} - ${pageInfo.endcount} 筆，共 ${pageInfo.records} 筆`}</small>
                    <nav class="pager">
                        <button disabled={pageInfo.page <= 1} class="oi" data-glyph="media-step-backward" title="到最前頁" type="button" onClick={() => this.conditionGetData(1)}></button>
                        <button disabled={pageInfo.page <= 1} class="oi" data-glyph="chevron-left" title="上一頁" type="button" onClick={() => this.conditionGetData(pageInfo.page - 1)}></button>
                        <span>第<input name="page" class="form-element" type="number" value={pageInfo.page} onChange={(e) => this.handleInputChange(e)} />頁，共 {pageInfo.total} 頁</span>
                        <button disabled={pageInfo.page >= pageInfo.total} class="oi" data-glyph="chevron-right" title="下一頁" type="button" onClick={() => this.conditionGetData(pageInfo.page + 1)}></button>
                        <button disabled={pageInfo.page >= pageInfo.total} class="oi" data-glyph="media-step-forward" title="到最後頁" type="button" onClick={() => this.conditionGetData(pageInfo.total)}></button>
                    </nav>
                </footer>
            )
        }
        return <div></div>;

    }
}