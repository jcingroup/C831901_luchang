"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_dom_1 = require("react-dom");
var TopNode = /** @class */ (function (_super) {
    __extends(TopNode, _super);
    function TopNode(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    TopNode.prototype.render = function () {
        return React.createElement("div", null,
            React.createElement("label", null, "1234"));
    };
    return TopNode;
}(React.Component));
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Grid.prototype.render = function () {
        return React.createElement("div", null);
    };
    return Grid;
}(React.Component));
react_dom_1.render(React.createElement(TopNode, null), document.getElementById('root1'));
//# sourceMappingURL=app.js.map