
import React = require('react');
import ReactDOM from 'react-dom';

//頂端元件
interface TopNodeProps {
    edit_type?: IEditType,
}
class TopNode extends React.Component<TopNodeProps, any>{
    constructor() {
        super();
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

    constructor() {
        super();
        this.state = {};
    }
    render() { }
}

ReactDOM.render(<TopNode />, document.getElementById('root'));