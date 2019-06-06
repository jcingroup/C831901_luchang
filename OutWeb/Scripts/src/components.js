import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { HttpProcess } from './httpunity';

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
    }
    render() {

        return (
            <header class="table-head">
                <label class="label">狀態</label>
                <select class="form-element">
                    <option hidden>請選擇</option>
                    <option value="A">全部</option>
                    <option value="Y">上架</option>
                    <option value="N">下架</option>
                </select>
                <input type="text" class="form-element" placeholder="請輸入關鍵字" />
                <button class="btn oi" data-glyph="magnifying-glass" id="searchBtn">搜尋</button>
            </header>
        )
    }
}


export class Table extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     details: null
        // };
        this.renderEditPage = this.renderEditPage.bind(this);
    }

    renderEditPage(id) {
        this.props.renderEditPage(id);
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
                            <th><button id="sortDisplayForFront" type="button" sort-type="" class="th-sort-toggle">上架狀態</button></th>
                            <th><button id="sortIndex" sort-type="" type="button" class="th-sort-toggle">排序</button></th>
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
                                        <td><span class="label-success">{disabledDesc}</span></td>
                                        <td>{statusDesc}</td>
                                        <td class="text-left">{item.UPD_DT_STR}</td>
                                        <td><button class="hover-danger oi" title="刪除" type="button" data-glyph="trash">刪除</button></td>
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
    }
    render() {

        return (
            <footer class="table-foot">
                <small class="pull-right">第 1 - 10 筆，共 100 筆</small>
                <nav class="pager">
                    <button class="oi" data-glyph="media-step-backward" title="到最前頁" type="button"></button>
                    <button class="oi" data-glyph="chevron-left" title="上一頁" type="button"></button>
                    <span>第<input id="numPage" name="page" class="form-element" type="number" value="1" />頁，共 10 頁</span>
                    <button class="oi" data-glyph="chevron-right" title="下一頁" type="button"></button>
                    <button class="oi" data-glyph="media-step-forward" title="到最後頁" type="button"></button>
                </nav>
            </footer>
        )
    }
}