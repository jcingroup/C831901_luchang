import * as React from 'react';
import { bindActionCreators, Store } from 'redux';
import { connect } from 'react-redux';
// import update from 'immutability-helper';
import { ac, chgBranchId, setMenuSubToRight } from './actions';

interface MasterMenuProps {
    MenuData?: Array<server.Menu>
    MenuFlow?: {
        branch_id: number,
        now_menu_name: string
    },
    collapseMenu?: Function,
    store?: Store
}

interface MasterMenuState {
    now_path_strace: Array<string>,
    click_menu_id: string,
    click_flag: boolean
}
class MasterMenu extends React.Component<MasterMenuProps, MasterMenuState>{

    constructor(props) {
        super(props);
        this.clkNav = this.clkNav.bind(this);
        this.clkNavItem = this.clkNavItem.bind(this);
        this.renderSetMenu = this.renderSetMenu.bind(this);
        this.chgBranchId = this.chgBranchId.bind(this);
        this.state = {
            now_path_strace: [],
            click_menu_id: null,
            click_flag: false
        };
    }
    componentDidMount() {
    }

    clkNav(menu: server.Menu, e: any) {
        var className: string = e.target.className;

        this.setState({
            now_path_strace: menu.PathStrace,
            click_menu_id: menu.Id,
            click_flag: className.indexOf('active') > 0 //偵測是否有active關鍵字 做收合切換動作
        });
    }
    clkNavItem(menu: server.Menu, e) {

        let Id = menu.Id;
        let menu_name = menu.ItemName;
        let { store } = this.props;

        store.dispatch(setMenuSubToRight(Id, menu_name));
        e.preventDefault();
    }
    chgBranchId(e) {
        let input = e as HTMLInputElement;
        let { store } = this.props;
        store.dispatch(chgBranchId(parseInt(input.value, 10)));
    }
    setMenuToRight(Id: string, e) {

    }

    renderSetMenu(menu: server.Menu) {

        let { now_path_strace, click_menu_id, click_flag } = this.state;

        if (menu.ClickMode == "Down") {

            let colleElement = [];

            //是否在路行徑上 1、點選的項目 Id要符合 2、click_flag 要沒點選打開 3、必需要在節點路行上
            let is_on_active = (click_menu_id == menu.Id && !click_flag && now_path_strace.some(x => x == menu.Id)) ||
                (click_menu_id != menu.Id && now_path_strace.some(x => x == menu.Id)); // 或 雖不是被點選 但有在路徑上代表子項目被點選

            //current
            let header = <header
                className={'collapse-toggle oi' + (is_on_active ? ' active' : '')}
                data-glyph={menu.DataGlyph}
                onClick={this.clkNav.bind(this, menu)}
            >
                {menu.ItemName}
                <i className="arrow down"></i>
            </header>;
            colleElement.push(header);

            let Items;
            if (menu.Items && menu.Items.length > 0) {
                Items = <nav className={'collapse-content' + (is_on_active ? ' in' : '')}>
                    {
                        menu.Items.map((e) => {

                            //是否在路行徑上 1、點選的項目 Id要符合 2、click_flag 要沒點選打開 3、必需要在節點路行上
                            let is_item_on_active = (click_menu_id == e.Id && !click_flag && now_path_strace.some(x => x == e.Id));

                            return <a key={e.Id}
                                className={is_item_on_active ? 'active' : ''}
                                data-glyph={menu.DataGlyph}
                                onClick={this.clkNavItem.bind(this, e)}
                            >
                                {e.ItemName}
                            </a>
                        })
                    }
                </nav>;
                colleElement.push(Items);
            }

            return colleElement;

        } else if (menu.ClickMode == "Right") {
            let Items = <a
                className={'nav-item oi'}
                data-glyph={menu.DataGlyph}
                onClick={this.clkNavItem.bind(this, menu)}
            >
                {menu.ItemName}
            </a>;
            return Items;
        } else {
            return <div></div>;
        }
    }

    render() {

        let { children, MenuData, MenuFlow } = this.props;
        if (MenuData && MenuFlow)
            return <>
                <main id="main">
                    <header className="title">
                        <h2>{MenuFlow.now_menu_name}</h2>
                        <ul className="breadcrumb">
                            <li>HOME</li>
                            {'@RenderSection("Breadcrumb", false)'}
                        </ul>
                    </header>
                    {children}
                </main>

                <aside id="sidebar">
                    <select className="switch-com" onChange={this.chgBranchId}>
                        <option value={0} hidden>請選擇子公司</option>
                        <option value={1}>A子公司</option>
                        <option value={2}>B子公司</option>
                        <option value={3}>C子公司</option>
                    </select>
                    {
                        MenuData.map((e) => {
                            return this.renderSetMenu(e);
                        })
                    }
                </aside>
            </>
    }
}

const collapseMenu = (data) => {
    return {
        type: ac.collapse_menu,
        data
    }
}

//interface MasterMenuState {
//    menudata: Array<server.Menu>
//}
export default connect<any, any, any, any>(
    state => ({
        MenuData: state.menu_tree,
        MenuFlow: state.MenuFlow
    }),
    (dispatch, ownProps) => bindActionCreators({
        collapseMenu
    }, dispatch)
)(MasterMenu)

