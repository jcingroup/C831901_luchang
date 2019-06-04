"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
class TopNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return React.createElement("div", null,
            React.createElement("label", null, "1234"));
    }
}
class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return React.createElement("div", null);
    }
}
react_dom_1.render(React.createElement(TopNode, null), document.getElementById('root1'));
