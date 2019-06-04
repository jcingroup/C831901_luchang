
import React = require('react');
import { render } from 'react-dom';

//頂端元件
interface TopNodeProps {
    edit_type?: IEditType,
}
class TopNode extends React.Component<TopNodeProps, any>{
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return <div></div>;
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
    menu_name?: string,
    callEdit?: Function,
    callRemove?: Function,
    callPage?: Function,
    callLoad?: Function,
    addState?: Function,
    setQueryValue?: Function,
    setPage?: Function
}

class Grid extends React.Component<GridProps, any>{

    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return <div></div>;
    }
}

render(<TopNode />, document.getElementById('root'));