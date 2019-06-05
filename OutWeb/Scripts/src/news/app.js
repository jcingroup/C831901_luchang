"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
    系統名稱:  資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
const React = require("react");
const react_redux_1 = require("react-redux");
const redux_1 = require("redux");
const com_datepick_1 = require("../../comm/com-datepick");
const addMaster_1 = require("../inc/addMaster");
const OrderButton_1 = require("../../comm/OrderButton");
const com_fileupload_1 = require("../../comm/com-fileupload");
const components_1 = require("../../comm/components");
const pub_1 = require("./pub");
const comm_func_1 = require("../../comm/comm-func");
const local_1 = require("./local");
let res = local_1.default();
class TopNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        console.log('menu_data', this.props.menu_data, "menu_click_id", this.props.menu_to_right);
        return React.createElement("div", null,
            React.createElement(GridView, null),
            React.createElement(EditView, null));
    }
}
class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.ChgQryVal = this.ChgQryVal.bind(this);
        //this.clkSearch = this.clkSearch.bind(this);
        this.callEdit = this.callEdit.bind(this);
        this.clkAdd = this.clkAdd.bind(this);
        this.callRemove = this.callRemove.bind(this);
        this.ForPageFooterQuery = this.ForPageFooterQuery.bind(this);
        this.CallGridNow = this.CallGridNow.bind(this);
        this.CallGridSort = this.CallGridSort.bind(this);
        this.keep_search = {};
        this.keep_field = null;
        this.keep_sort = null;
        this.state = {};
    }
    componentDidMount() {
        //store.dispatch(ACCallLoad({}));
        let { search } = this.props;
        pub_1.store.dispatch(pub_1.ACCallGrid(1, null, null, search, true));
    }
    componentDidUpdate(prevProps, prevState) {
        let pp = this.props;
        if (prevProps.oper_id != pp.oper_id) {
            this.CallGridNow();
        }
    }
    ChgQryVal(name, value, e) {
        let { search } = this.props;
        pub_1.store.dispatch(pub_1.ACQueryValue(name, value));
        let { field, sort } = this.props.page_grid;
        pub_1.store.dispatch(pub_1.ACCallGrid(1, field, sort, search, true)); // 自動搜尋加這行
    }
    ForPageFooterQuery(page) {
        let { search } = this.props;
        let { field, sort } = this.props.page_grid;
        // 第一種
        pub_1.store.dispatch(pub_1.ACCallGrid(page, field, sort, search, true));
        // 第二種
        this.props.ACCallGrid(page, field, sort, search, true);
    }
    CallGridNow() {
        let { page } = this.props.page_grid;
        this.ForPageFooterQuery(page);
    }
    CallGridSort(_field, _sort) {
        let { search } = this.props;
        pub_1.store.dispatch(pub_1.ACCallGrid(1, _field, _sort, search, true));
    }
    callEdit(id, e) {
        pub_1.store.dispatch(pub_1.ACCallEdit(id));
    }
    clkAdd(e) {
        pub_1.store.dispatch(pub_1.ACInsertModel());
    }
    callRemove(id, e) {
        if (confirm(gb_Lang.delete_sure)) {
            pub_1.store.dispatch(pub_1.ACCallRemove(id, {}));
            this.CallGridNow();
        }
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let st = this.state;
        if (!pp.page_grid)
            return null;
        let row_data = pp.page_grid.rows;
        let row_empty = [];
        for (var i = 0; i < 10 - row_data.length; i++) {
            row_empty.push({});
        }
        let show = pp.edit_type == 0 /* none */ ? 'block' : 'none';
        out_html = React.createElement("div", { style: { display: show } },
            React.createElement("h3", { className: "title" }, this.props.menu_name),
            React.createElement("div", { className: "alert-warning mb-16" },
                React.createElement("strong", null, "\u524D\u53F0\u6392\u5E8F:"),
                "\u6578\u5B57\u6108\u5927\u6108\u524D\u9762"),
            React.createElement("div", { className: "topBtn-bar btn-group" },
                React.createElement(components_1.PWButton, { className: "btn success oi", dataGlyph: "plus", onClick: this.clkAdd }, gb_Lang.add)),
            React.createElement("header", { className: "table-head form-inline" },
                React.createElement("label", null, "\u65E5\u671F"),
                React.createElement("label", null, "\u524D\u53F0\u986F\u793A"),
                React.createElement(components_1.SelectText, { onChange: this.ChgQryVal.bind(this, 'state'), options: [{ value: 'A', label: '顯示' }, { value: 'S', label: '隱藏' }], is_blank: true, value: pp.search.state }),
                React.createElement(components_1.InputText, { onChange: this.ChgQryVal.bind(this, 'keyword'), value: pp.search.keyword, placeholder: "\u8ACB\u8F38\u5165\u95DC\u9375\u5B57" })),
            React.createElement("table", { className: "table-list table-hover table-striped" },
                React.createElement("colgroup", null,
                    React.createElement("col", { span: 3 }),
                    React.createElement("col", { style: { width: '16%' } }),
                    React.createElement("col", { span: 2, style: { width: '14%' } })),
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", { className: "item-edit" }, gb_Lang.delete),
                        React.createElement("th", { className: "item-edit" }, gb_Lang.modify),
                        React.createElement("th", { className: "text-left" },
                            React.createElement(OrderButton_1.default, { title: res.grid.title, field: 'news_title', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.CallGridSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: res.grid.publish_date, field: 'day', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.CallGridSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: res.grid.sort, field: 'sort', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.CallGridSort })),
                        React.createElement("th", null,
                            React.createElement(OrderButton_1.default, { title: res.grid.state, field: 'state', sort: pp.page_grid.sort, now_field: pp.page_grid.field, setSort: this.CallGridSort })))),
                React.createElement("tbody", null,
                    row_data.map((item, i) => {
                        return React.createElement("tr", { key: item.news_id },
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-danger oi", title: gb_Lang.delete, dataGlyph: "trash", onClick: this.callRemove.bind(this, item.news_id) })),
                            React.createElement("td", { className: "item-edit" },
                                React.createElement(components_1.PWButton, { className: "hover-success oi", title: gb_Lang.modify, dataGlyph: "pencil", onClick: this.callEdit.bind(this, item.news_id) })),
                            React.createElement("td", { className: "text-left" }, item.news_title),
                            React.createElement("td", null, comm_func_1.stdDate(item.day)),
                            React.createElement("td", null, item.sort),
                            React.createElement("td", null, React.createElement(GridState, { code: item.state })));
                    }),
                    row_empty.map((item, i) => {
                        return React.createElement("tr", { key: 'empty_row_' + i },
                            React.createElement("td", { colSpan: 6 }, "\u00A0"));
                    }))),
            React.createElement(components_1.PageFooter, { page_grid: pp.page_grid, callPage: this.ForPageFooterQuery }));
        return out_html;
    }
}
class Edit extends React.Component {
    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
        this.state = {
            option_prodkind: [],
        };
    }
    componentDidMount() {
        //CKEDITOR.replace('news_content', { customConfig: '../ckeditor/config.js?v2=' + tim() });
        //ft<server.ProdKind[]>(ap.GET__api_News).then((data) => {
        //    let options = data.map((item, i) => {
        //        let r: SelectTextOptions = { value: item.prodkind_id, label: item.kind_name };
        //        return r;
        //    });
        //    this.setState({ option_prodkind: options })
        //})
    }
    componentWillReceiveProps(nextProps) {
        //if (this.props.edit_type == IEditType.none && (nextProps.edit_type == IEditType.insert || nextProps.edit_type == IEditType.modify)) {
        //CKEDITOR.instances['news_content'].setData(nextProps.field.news_content);
        //}
    }
    chgFldVal(field, value, e) {
        pub_1.store.dispatch(pub_1.ACInputValue(field, value));
    }
    chgContext(contentState) {
        //console.log('check', contentState.getCurrentContent());
        this.setState({
        //contentState,
        });
    }
    submit(e) {
        e.preventDefault();
        let { edit_type, field } = this.props;
        let { news_id } = this.props.field;
        pub_1.store.dispatch(pub_1.ACSubmit(news_id, edit_type, field));
        return;
    }
    cancel(e) {
        pub_1.store.dispatch(pub_1.ACCancel(this.props.kfield));
        pub_1.store.dispatch(pub_1.ACReturnGridView());
    }
    render() {
        let out_html = null;
        let pp = this.props;
        let { field } = pp;
        let st = this.state;
        let show = pp.edit_type == 1 /* insert */ || pp.edit_type == 2 /* modify */ ? 'block' : 'none';
        out_html = React.createElement("div", { style: { display: show } },
            React.createElement("h3", { className: "title" },
                this.props.menu_name,
                " ",
                React.createElement("small", { className: "oi", "data-glyph": "tags" }, "\u7DE8\u8F2F")),
            React.createElement("form", { className: "form-list", onSubmit: this.submit },
                React.createElement("section", { className: "row" },
                    React.createElement("div", { className: "col-6" },
                        React.createElement("dl", { className: "field" },
                            React.createElement("dt", { className: "col-2" }, "\u6A19\u984C"),
                            React.createElement("dd", { className: "col-10" },
                                React.createElement(components_1.InputText, { inputClassName: "form-element", onChange: this.chgFldVal.bind(this, 'news_title'), value: field.news_title, required: true, maxLength: 64 }))),
                        React.createElement("dl", { className: "field" },
                            React.createElement("dt", { className: "col-2" }, "\u767C\u5E03\u65E5\u671F"),
                            React.createElement("dd", { className: "col-10" },
                                React.createElement(com_datepick_1.DatePickText, { inputClassName: "form-element", inputViewMode: 1 /* edit */, onChange: this.chgFldVal.bind(this, 'day'), value: field.day }))),
                        React.createElement("dl", { className: "field" },
                            React.createElement("dt", { className: "col-2" }, "\u6392\u5E8F"),
                            React.createElement("dd", { className: "col-10" },
                                React.createElement(components_1.InputNum, { inputClassName: "form-element inline", onChange: this.chgFldVal.bind(this, 'sort'), value: field.sort, required: true }),
                                React.createElement("small", null, "\u6578\u5B57\u6108\u5927\u6108\u524D\u9762"))),
                        React.createElement("dl", { className: "field" },
                            React.createElement("dt", { className: "col-2" }, "\u986F\u793A\u72C0\u614B"),
                            React.createElement("dd", { className: "col-4" },
                                React.createElement(components_1.RadioText, { inputClassName: "radio", id: 'state_0', value: 'A', checked: field.state == 'A', inputViewMode: 1 /* edit */, onClick: this.chgFldVal.bind(this, 'state') }),
                                React.createElement("label", { htmlFor: "state_0" }),
                                "\u986F\u793A",
                                React.createElement(components_1.RadioText, { inputClassName: "radio", id: 'state_1', value: 'S', checked: field.state == 'S', inputViewMode: 1 /* edit */, onClick: this.chgFldVal.bind(this, 'state') }),
                                React.createElement("label", { htmlFor: "state_1" }),
                                "\u96B1\u85CF"))),
                    React.createElement("div", { className: "col-6" },
                        React.createElement("dl", { className: "field" },
                            React.createElement("dt", { className: "col-2" }, "\u5217\u8868\u5716"),
                            React.createElement("dd", { className: "col-10" }, pp.edit_type == 2 /* modify */ ?
                                React.createElement(com_fileupload_1.default, { id: field.news_id, fileKey: "news_list", title: "\u5716\u7247\u4E0A\u50B3", is_img: true })
                                : React.createElement("span", { className: "text-danger" }, gb_Lang.after_insert))))),
                React.createElement("fieldset", { className: "mt-16" },
                    React.createElement("legend", { className: "underline" }, "[ \u7DE8\u8F2F\u5167\u5BB9 ]"),
                    React.createElement(components_1.AreaText, { value: field.news_content, onChange: this.chgFldVal.bind(this, 'news_content') })),
                React.createElement("footer", { className: "submit-bar fixed-bottom mt-24" },
                    React.createElement(components_1.PWButton, { type: "submit", className: "btn success oi", dataGlyph: "circle-check" }, gb_Lang.save),
                    React.createElement(components_1.PWButton, { type: "button", className: "btn warning oi", dataGlyph: "circle-x", onClick: this.cancel }, gb_Lang.return_list))));
        return out_html;
    }
}
const GridState = ({ code }) => {
    if (code == 'A')
        return React.createElement("span", { className: "label-success" }, "\u986F\u793A");
    else if (code == 'S')
        return React.createElement("span", { className: "label-muted" }, "\u96B1\u85CF");
    else
        return React.createElement("span", { className: "label" }, "No");
};
/*=========================Redux連接元件及Action=========================*/
const TopNodeToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        menu_to_right: state.menu_to_right,
        menu_data: state.menu_tree
    };
};
const TopNodeDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({}, dispatch);
    return s;
};
let TopNodeView = react_redux_1.connect(TopNodeToProps, TopNodeDispatch)(TopNode);
const GridToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        oper_id: state.oper_id
    };
};
const GridDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({
        ACCallGrid: pub_1.ACCallGrid
    }, dispatch);
    return s;
};
let GridView = react_redux_1.connect(GridToProps, GridDispatch)(Grid);
const EditToProps = (state, ownProps) => {
    //let menu = getMenuName(state.menudata);
    return {
        //menu_name: menu.m2,
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        kfield: state.kfield,
        field: state.field
    };
};
const EditDispatch = (dispatch, ownProps) => {
    let s = redux_1.bindActionCreators({}, dispatch);
    return s;
};
let EditView = react_redux_1.connect(EditToProps, EditDispatch)(Edit);
addMaster_1.AddMasterMenu(TopNodeView, pub_1.store, gb_menu_id);
