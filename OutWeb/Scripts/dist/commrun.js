(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["commrun"],{

/***/ "./Scripts/comm/comm-run.js":
/*!**********************************!*\
  !*** ./Scripts/comm/comm-run.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n(function () {\n  //修正babel ie10 無法 call class constructor\n  var testObject = {};\n\n  if (!(Object.setPrototypeOf || testObject.__proto__)) {\n    var nativeGetPrototypeOf = Object.getPrototypeOf;\n\n    Object.getPrototypeOf = function (object) {\n      if (object.__proto__) {\n        return object.__proto__;\n      } else {\n        return nativeGetPrototypeOf.call(Object, object);\n      }\n    };\n  } //IE 無法用 Object.assign\n\n\n  if (!Object.assign) {\n    Object.defineProperty(Object, 'assign', {\n      enumerable: false,\n      configurable: true,\n      writable: true,\n      value: function value(target) {\n        'use strict';\n\n        if (target === undefined || target === null) {\n          throw new TypeError('Cannot convert first argument to object');\n        }\n\n        var to = Object(target);\n\n        for (var i = 1; i < arguments.length; i++) {\n          var nextSource = arguments[i];\n\n          if (nextSource === undefined || nextSource === null) {\n            continue;\n          }\n\n          nextSource = Object(nextSource);\n          var keysArray = Object.keys(Object(nextSource));\n\n          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {\n            var nextKey = keysArray[nextIndex];\n            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);\n\n            if (desc !== undefined && desc.enumerable) {\n              to[nextKey] = nextSource[nextKey];\n            }\n          }\n        }\n\n        return to;\n      }\n    });\n  } //製作SelectOption集合\n\n\n  if (Array.prototype.optMake === undefined) {\n    Array.prototype.optMake = function (func1, func2) {\n      var _this = this; //console.log('func', func)\n\n\n      var p = new Array();\n\n      var values = _this.map(func1);\n\n      var items = _this.map(func2);\n\n      for (var i = 0; i < values.length; i++) {\n        var v = values[i];\n        var t = items[i].toString();\n        var o = {\n          value: v,\n          label: t\n        };\n        p.push(o);\n      } //console.log('get_sum', get_sum)\n\n\n      return p;\n    };\n  } //對陣列物件 數值型欄位做加總\n\n\n  if (Array.prototype.sum === undefined) {\n    Array.prototype.sum = function (func) {\n      var _this = this; //console.log('func', func)\n\n\n      var get_sum = _this.map(func).reduce(function (pre, cur) {\n        //console.log('check', 'reduce', pre, cur);\n        if (cur !== undefined && cur !== null && cur.toString() != '') return pre + cur;else return pre;\n      }, 0); //console.log('get_sum', get_sum)\n\n\n      return get_sum;\n    };\n  } //對浮點數值型 取小數位數 \n\n\n  if (Number.prototype.floatSpot === undefined) {\n    Number.prototype.floatSpot = function (pos) {\n      if (this !== undefined && this !== null) {\n        var size = Math.pow(10, pos);\n        return Math.round(this * size) / size;\n      }\n    };\n  } //除數 \n\n\n  if (Number.prototype.divisor === undefined) {\n    Number.prototype.divisor = function (num) {\n      if (this != undefined && this !== null && num) {\n        return this / num;\n      }\n    };\n  } //找出陣列物件 index (ie11無法使用js內建findIndex)\n\n\n  if (Array.prototype.findIndex === undefined) {\n    Array.prototype.findIndex = function (func) {\n      var index = -1;\n\n      var _this = this;\n\n      _this.map(func).forEach(function (item, i) {\n        if (item) {\n          index = i;\n        }\n      });\n\n      return index;\n    };\n  } //找出陣列物件 (ie11無法使用es6內建find)\n\n\n  if (Array.prototype.find === undefined) {\n    Array.prototype.find = function (func) {\n      var _this = this; //找尋陣列中第一個符合的元素回傳(filter ie9以上才支援)\n\n\n      var res = _this.filter(func);\n\n      var obj = res.length > 0 ? res[0] : null; //找尋陣列中全部符合的元素\n      //let arr = [];\n      //_this.filter(func).map((item, i) => {\n      //    arr.push(item);\n      //});\n\n      return obj;\n    };\n  }\n})();\n\n//# sourceURL=webpack:///./Scripts/comm/comm-run.js?");

/***/ })

},[["./Scripts/comm/comm-run.js","manifest"]]]);