/**
    系統名稱:  資料維
    檔案內容:本系統進入點及介面呈現
    2017-03-31  Jerry   建立
*/
import React = require('react');
import { connect } from 'react-redux';
import { bindActionCreators, AnyAction } from 'redux';
import { DatePickText } from '../../comm/com-datepick';

import { AddMasterMenu } from '../inc/addMaster';
import OrderButton from '../../comm/OrderButton';
import FileUpBtn from '../../comm/com-fileupload';
import { PWButton, SelectText, AreaText, InputText, InputNum, RadioText, CheckText, PageFooter } from '../../comm/components';
import { ACCallRemove, ACInsertModel, ACCallEdit, ACQueryValue, ACInputValue, ACCallLoad, ACCallPage, ACSubmit, ACCancel, ACReturnGridView, store, ACSetToPage, ACCallGrid, AddCallGrid } from './pub';
import { getMenuName, stdDate, tim } from '../../comm/comm-func';
import loc from './local';

let res = loc();

//頂端元件
interface TopNodeProps {
    edit_type?: IEditType,
    menu_to_right?: Array<server.Menu>,
    menu_data?: Array<server.Menu>
}
class TopNode extends React.Component<TopNodeProps, any>{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        //console.log('menu_data', this.props.menu_data, "menu_click_id", this.props.menu_to_right);

        return <div>
            <AddView />
            <GridView />
            <EditView />
        </div>;
    }
}


interface addProps {
    edit_type?: IEditType,
    field?: server.News,
}

class addGrid extends React.Component<addProps, any>{

    constructor(props) {
        super(props);
        this.chgFldVal = this.chgFldVal.bind(this);
        //this.chgTotal = this.chgTotal.bind(this);
        this.state = {};
    }

    chgFldVal(addName: string, e: React.SyntheticEvent<EventTarget>) {
        let input: HTMLInputElement = e.target as HTMLInputElement;
        let valueTotal = 0;
        store.dispatch<any>(AddCallGrid(addName, input.value, valueTotal));
    }

    //chgTotal() {
    //    let { field } = this.props;
    //    store.dispatch<any>(OutputTotal(field, field.news_numberX, field.news_numberY));
    //}

    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let { field } = pp;
        let total = this.chgFldVal.bind(this, 'total');

        let show = pp.edit_type == IEditType.none ? 'block' : 'none';
        out_html = <div style={{ display: show }}>
            <input
                type="number"
                onChange={this.chgFldVal.bind(this, 'news_numberX')}
                value={field.news_numberX}
            /> 
            +
            <input
                type="number"
                onChange={this.chgFldVal.bind(this, 'news_numberY')}
                value={field.news_numberY}
            />
            = {total}
        </div>;

        return out_html;
    }
}

//列表介面元件
interface GridProps {
    search?: {
        keyword: string,
        state: string,
        day: any
    },
    oper_id?: string,
    edit_type?: IEditType,
    menu_name?: string,
    page_grid?: GridInfo<server.News>,
    ACCallGrid?: (page: number, field: string, sort: string, query: object, is_query_item: boolean) => any
}
class Grid extends React.Component<GridProps, any>{

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
        store.dispatch<any>(ACCallGrid(1, null, null, search, true));
    }
    componentDidUpdate(prevProps, prevState) {

        let pp = this.props

        if (prevProps.oper_id != pp.oper_id) {
            this.CallGridNow();
        }
    }
    keep_search;
    keep_field;
    keep_sort;

    ChgQryVal(name, value: any, e: React.SyntheticEvent<EventTarget>) {
        let { search } = this.props;
        store.dispatch(ACQueryValue(name, value));
        let { field, sort } = this.props.page_grid;
        store.dispatch<any>(ACCallGrid(1, field, sort, search, true)); // 自動搜尋加這行
    }

    ForPageFooterQuery(page: number) {
        let { search } = this.props;
        let { field, sort } = this.props.page_grid;

        // 第一種
        store.dispatch<any>(ACCallGrid(page, field, sort, search, true));

        // 第二種
        this.props.ACCallGrid(page, field, sort, search, true);
    }

    CallGridNow() {
        let { page } = this.props.page_grid;
        this.ForPageFooterQuery(page);
    }

    CallGridSort(_field, _sort) {
        let { search } = this.props;
        store.dispatch<any>(ACCallGrid(1, _field, _sort, search, true));
    }

    callEdit(id, e: React.SyntheticEvent<EventTarget>) {
        store.dispatch<any>(ACCallEdit(id));
    }
    clkAdd(e: React.SyntheticEvent<EventTarget>) {
        store.dispatch<any>(ACInsertModel());
    }

    callRemove(id, e: React.SyntheticEvent<EventTarget>) {
        if (confirm(gb_Lang.delete_sure)) {
            store.dispatch<any>(ACCallRemove(id, {}));
            this.CallGridNow();
        }
    }

    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let st = this.state;

        if (!pp.page_grid)
            return null;

        let row_data = pp.page_grid.rows;

        let row_empty = [];
        for (var i = 0; i < 10 - row_data.length; i++) {
            row_empty.push({});
        }

        let show = pp.edit_type == IEditType.none ? 'block' : 'none';

        out_html = <div style={{ display: show }}>
            <header className="title">
                <h2>專欄管理</h2>
                <ul className="breadcrumb">
                    <li>HOME</li>
                    <li>專欄管理</li>
                </ul>
            </header>
            <div className="panel-warning mb-m">
                <strong>排序：</strong>無值或數字相同時以新增時間愈近愈前面，若給值時則數字愈大愈前面。
            </div>
            <div className="topBtn-bar btn-group">
                <PWButton className="btn success oi" dataGlyph="plus" onClick={this.clkAdd}>{gb_Lang.add}</PWButton>
            </div>
            <header className="table-head">
                <label className="label">狀態</label>
                <SelectText
                    inputClassName="form-element"
                    onChange={this.ChgQryVal.bind(this, 'state')}
                    options={[{ value: 'A', label: '上架' }, { value: 'S', label: '下架' }]}
                    is_blank={true}
                    value={pp.search.state}
                />

                <InputText
                    inputClassName="form-element"
                    onChange={this.ChgQryVal.bind(this, 'keyword')}
                    value={pp.search.keyword}
                    placeholder="請輸入關鍵字"

                />
            </header>
            <table className="table-list table-hover table-striped">
                <colgroup>
                    <col span={2} />
                    <col style={{ width: '40%' }} />
                    <col span={2} style={{ width: '140px' }} />
                </colgroup>
                <thead>
                    <tr>
                        <th className="item-edit">{gb_Lang.modify}</th>
                        <th>
                            <OrderButton title={res.grid.publish_date}
                                field={'day'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.CallGridSort} />
                        </th>
                        <th className="text-left">
                            <OrderButton title={res.grid.title}
                                field={'news_title'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.CallGridSort} />
                        </th>
                        <th>
                            <OrderButton title={res.grid.state}
                                field={'state'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.CallGridSort} />
                        </th>
                        <th>
                            <OrderButton title={res.grid.sort}
                                field={'sort'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.CallGridSort} />
                        </th>
                        <th>
                            <OrderButton title={res.grid.publish_date}
                                field={'day'}
                                sort={pp.page_grid.sort}
                                now_field={pp.page_grid.field}
                                setSort={this.CallGridSort} />
                        </th>
                        <th className="item-edit">{gb_Lang.delete}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        row_data.map((item, i) => {
                            return <tr key={item.news_id}>
                                <td className="item-edit"><PWButton className="hover-success oi" title={gb_Lang.modify} dataGlyph="pencil" onClick={this.callEdit.bind(this, item.news_id)}></PWButton></td>
                                <td>{stdDate(item.day)}</td>
                                <td className="text-left">{item.news_title}</td>
                                <td>{<GridState code={item.state} />}</td>
                                <td>{item.sort}</td>
                                <td>{stdDate(item.day)}</td>
                                <td className="item-edit"><PWButton className="hover-danger oi" title={gb_Lang.delete} dataGlyph="trash" onClick={this.callRemove.bind(this, item.news_id)}></PWButton></td>
                            </tr>
                        })
                    }
                    {
                        row_empty.map((item, i) => { //不足列數補空列數
                            return <tr key={'empty_row_' + i}><td colSpan={7}>&nbsp;</td></tr>;
                        })
                    }
                </tbody>
            </table>
            <PageFooter page_grid={pp.page_grid} callPage={this.ForPageFooterQuery} />
        </div>;
        return out_html;
    }
}

//編輯資料元件
interface EditProps {
    edit_type?: IEditType
    field?: server.News
    kfield?: server.News
    exist?: boolean
    oper_id?: string
    menu_name?: string,
}

interface StateProps {
    option_prodkind: SelectTextOptions[],
}

class Edit extends React.Component<EditProps, StateProps>{

    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
        this.submit = this.submit.bind(this);
        this.chgFldVal = this.chgFldVal.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

        this.state = {
            option_prodkind: [],
            //contentState: EditorState.createEmpty() //EditorState.createEmpty()
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
    chgFldVal(field: string, value: any, e: React.SyntheticEvent<EventTarget>) {
        
        store.dispatch(ACInputValue(field, value));
    }

    chgContext(contentState) {
        //console.log('check', contentState.getCurrentContent());
        this.setState({
            //contentState,
        });
    }

    submit(e: React.FormEvent<EventTarget>) {
        e.preventDefault();
        let { edit_type, field } = this.props;
        let { news_id } = this.props.field;
        store.dispatch<any>(ACSubmit(news_id, edit_type, field));
        return;
    }
    cancel(e) {
        store.dispatch(ACCancel(this.props.kfield));
        store.dispatch(ACReturnGridView());
    }
    render() {

        let out_html: JSX.Element = null;
        let pp = this.props;
        let { field } = pp;
        let st = this.state;
        let show = pp.edit_type == IEditType.insert || pp.edit_type == IEditType.modify ? 'block' : 'none';

        out_html = <div style={{ display: show }}>
            <h3 className="title">{this.props.menu_name} <small className="oi" data-glyph="tags">編輯</small></h3>
            <form className="form-list" onSubmit={this.submit}>
                <section className="row">
                    {/*左邊是資料*/}
                    <div>
                        <dl className="row padding">
                            <dt className="col-2 text-right label"><sup className="help" title="必填">*</sup>標題</dt>
                            <dd className="col-8">
                                <InputText
                                    inputClassName="form-element full"
                                    onChange={this.chgFldVal.bind(this, 'news_title')}
                                    value={field.news_title}
                                    required={true}
                                    maxLength={64}
                                />
                            </dd>
                        </dl>
                        <dl className="row padding">
                            <dt className="col-2 text-right label"><sup className="help" title="必填">*</sup>作者</dt>
                            <dd className="col-4">
                                <InputText
                                    inputClassName="form-element full"
                                    onChange={this.chgFldVal.bind(this, 'news_author')}
                                    value={field.news_author}
                                    required={true}
                                    maxLength={64}
                                />
                            </dd>
                        </dl>
                        <dl className="row padding">
                            <dt className="col-2 text-right label">排序</dt>
                            <dd className="col-8">
                                <InputNum
                                    inputClassName="form-element"
                                    onChange={this.chgFldVal.bind(this, 'sort')}
                                    value={field.sort}
                                    required={true}
                                />
                                <small className="text-danger">* 無值或數字相同時以新增時間愈近愈前面，若給值時則數字愈大愈前面。</small>
                            </dd>
                        </dl>
                        <dl className="row padding">
                            <dt className="col-2 text-right label">狀態</dt>
                            <dd className="col-6">
                                <label htmlFor="state_0" className="control-group">
                                    <RadioText
                                        inputClassName="radio"
                                        id={'state_0'}
                                        value={'A'}
                                        checked={field.state == 'A'}
                                        inputViewMode={InputViewMode.edit}
                                        onClick={this.chgFldVal.bind(this, 'state')}
                                    />
                                    <i className="icon"></i>
                                    上架
                                </label>
                                <label htmlFor="state_1" className="control-group">
                                    <RadioText
                                        inputClassName="radio"
                                        id={'state_1'}
                                        value={'S'}
                                        checked={field.state == 'S'}
                                        inputViewMode={InputViewMode.edit}
                                        onClick={this.chgFldVal.bind(this, 'state')}
                                    />
                                    <i className="icon"></i>
                                    下架
                                </label>
                            </dd>
                        </dl>
                    </div>
                </section>

                <fieldset className="mt-16">
                    <legend className="underline">[ 編輯內容 ]</legend>
                    <AreaText value={field.news_content} onChange={this.chgFldVal.bind(this, 'news_content')} />
                </fieldset>

                <footer className="submit-bar fixed-bottom mt-24">
                    <PWButton type="submit" className="btn success oi" dataGlyph="circle-check">
                        {gb_Lang.save}
                    </PWButton>{}
                    <PWButton type="button" className="btn warning oi" dataGlyph="circle-x" onClick={this.cancel}>
                        {gb_Lang.return_list}
                    </PWButton>
                </footer>
            </form>
        </div>;
        return out_html;
    }
}
const GridState = ({ code }: { code: string }) => {
    if (code == 'A')
        return <span className="label-success">顯示</span>;
    else if (code == 'S')
        return <span className="label-muted">隱藏</span>;
    else
        return <span className="label">No</span>
}
/*=========================Redux連接元件及Action=========================*/
const TopNodeToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        menu_to_right: state.menu_to_right,
        menu_data: state.menu_tree
    }
}
const TopNodeDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
    }, dispatch);
    return s;
}
let TopNodeView = connect<{}, {}, {}>(TopNodeToProps, TopNodeDispatch)(TopNode)

const GridToProps = (state, ownProps) => {

    return {
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        oper_id: state.oper_id
    }
}
const GridDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        ACCallGrid
    }, dispatch);
    return s;
}

const addGridToProps = (state, ownProps) => {

    return {
        edit_type: state.edit_type,
        field: state.field
    }
}
const addGridDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        AddCallGrid
    }, dispatch);
    return s;
}
let AddView = connect<{}, {}, {}>(addGridToProps, addGridDispatch)(addGrid)

let GridView = connect<{}, {}, {}>(GridToProps, GridDispatch)(Grid)

const EditToProps = (state, ownProps) => {
    //let menu = getMenuName(state.menudata);

    return {
        //menu_name: menu.m2,
        edit_type: state.edit_type,
        page_grid: state.page_grid,
        search: state.search,
        kfield: state.kfield,
        field: state.field
    }
}
const EditDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
    }, dispatch);
    return s;
}
let EditView = connect<{}, {}, {}>(EditToProps, EditDispatch)(Edit)

AddMasterMenu(TopNodeView, store, gb_menu_id);