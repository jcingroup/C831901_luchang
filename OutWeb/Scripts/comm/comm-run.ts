(function () {

    //修正babel ie10 無法 call class constructor
    var testObject: any = {};

    if (!(Object.setPrototypeOf || testObject.__proto__)) {
        var nativeGetPrototypeOf = Object.getPrototypeOf;

        Object.getPrototypeOf = function (object) {
            if (object.__proto__) {
                return object.__proto__;
            } else {
                return nativeGetPrototypeOf.call(Object, object);
            }
        }
    }

    //IE 無法用 Object.assign
    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }
                    nextSource = Object(nextSource);

                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }

    //製作SelectOption集合
    if (Array.prototype.optMake === undefined) {
        Array.prototype.optMake = function (func1, func2) {
            const _this: Array<any> = this;
            //console.log('func', func)
            let p: Array<SelectTextOptions> = new Array();
            let values = _this.map(func1);
            let items = _this.map(func2);

            for (var i = 0; i < values.length; i++) {
                let v = values[i];
                let t = items[i].toString();
                let o: SelectTextOptions = {
                    value: v, label: t
                }
                p.push(o);
            }
            //console.log('get_sum', get_sum)
            return p;
        };
    }
    //對陣列物件 數值型欄位做加總
    if (Array.prototype.sum === undefined) {
        Array.prototype.sum = function (func: any) {
            const _this: Array<any> = this;
            //console.log('func', func)
            let get_sum = _this
                .map<number>(func)
                .reduce((pre: number, cur: number) => {
                    //console.log('check', 'reduce', pre, cur);
                    if (cur !== undefined && cur !== null && cur.toString() != '')
                        return pre + cur;
                    else
                        return pre;
                }, 0)

            //console.log('get_sum', get_sum)
            return get_sum;
        };
    }
    //對浮點數值型 取小數位數 
    if (Number.prototype.floatSpot === undefined) {
        Number.prototype.floatSpot = function (pos) {
            if (this !== undefined && this !== null) {
                let size = Math.pow(10, pos);
                return Math.round(this * size) / size;
            }
        }
    }
    //除數 
    if (Number.prototype.divisor === undefined) {
        Number.prototype.divisor = function (num) {
            if (this != undefined && this !== null && num) {
                return this / num;
            }
        }
    }

    //找出陣列物件 index (ie11無法使用js內建findIndex)
    if (Array.prototype.findIndex === undefined) {
        Array.prototype.findIndex = function (func) {
            let index = -1;
            const _this: Array<any> = this;

            _this.map<boolean>(func).forEach((item, i) => {
                if (item) {
                    index = i;
                }
            });
            return index;
        };
    }

    //找出陣列物件 (ie11無法使用es6內建find)
    if (Array.prototype.find === undefined) {
        Array.prototype.find = function (func) {
            const _this: Array<any> = this;
            //找尋陣列中第一個符合的元素回傳(filter ie9以上才支援)
            let res = _this.filter(func);
            let obj = res.length > 0 ? res[0] : null;

            //找尋陣列中全部符合的元素
            //let arr = [];
            //_this.filter(func).map((item, i) => {
            //    arr.push(item);
            //});
            return obj;
        };
    }
})();