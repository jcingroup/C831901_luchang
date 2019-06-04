import * as React from 'react';
import { bindActionCreators, Store } from 'redux';
import { connect } from 'react-redux';
// import update from 'immutability-helper';
import { ac, chgBranchId, setMenuSubToRight } from './actions';

interface RouteLayoutProps {

    MenuFlow?: {
    },
    prog_menu: server.Menu,
    breadcrumb: Array<string>,
    store?: Store
}

interface RouteLayoutState {

}
class RouteLayout extends React.Component<RouteLayoutProps, RouteLayoutState>{

    constructor(props) {
        super(props);
        this.renderBreadcrumb = this.renderBreadcrumb.bind(this);
        this.state = {
        };
    }
    componentDidMount() {
    }
    renderBreadcrumb() {
        let { breadcrumb } = this.props;
        return breadcrumb.join("/");
    }

    render() {
        let { children, prog_menu } = this.props;

        document.title = `${prog_menu.Id} ${prog_menu.ItemName}`;

        return <div id="wrapper" className="p-m font-md">
            <header className="title">
                <h2>{prog_menu.Id} 
                    {prog_menu.ItemName}
                </h2>
                <ul className="breadcrumb">
                    {this.renderBreadcrumb()}
                </ul>
            </header>
            {children}
        </div>
    }
}

export default connect<any, any, any, any>(
    state => ({
        MenuFlow: state.MenuFlow
    }),
    (dispatch, ownProps) => bindActionCreators({}, dispatch)
)(RouteLayout)

