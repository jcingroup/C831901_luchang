!function(e){var n={};function t(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,t),o.l=!0,o.exports}t.m=e,t.c=n,t.d=function(e,n,r){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:r})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var o in e)t.d(r,o,function(n){return e[n]}.bind(null,o));return r},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=2)}({2:function(e,n,t){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,n){for(var t=0;t<n.length;t++){var r=n[t];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(n,t,r){return t&&e(n.prototype,t),r&&e(n,r),n}}();n.HttpProcess=function(){function e(){!function(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}(this,e),this.API_PATH={LOGIN:"/_SysAdm/login",GET_LIST:"/api/News/List",GET_DATA:"/api/News/Edit",SAVE_DATA:"/api/News/Save",REMOVE_DATA:"/api/News/Remove",CHANGE_PW:"/_SysAdm/ChangePW"}}return r(e,[{key:"getApisPath",value:function(){return this.API_PATH}},{key:"fetchSendGet",value:function(e,n){var t=e;if(void 0!==n){var r=new URL(document.location.origin+e);Object.keys(n).forEach(function(e){return r.searchParams.append(e,n[e])}),t=r}return fetch(t,{method:"GET",credentials:"same-origin",headers:{pragma:"no-cache","cache-control":"no-cache"}}).then(function(e){return e.json()})}},{key:"fetchSendPost",value:function(e,n){var t={method:"POST",credentials:"same-origin",headers:{Accept:"application/json","Content-Type":"application/json",pragma:"no-cache","cache-control":"no-cache"},body:JSON.stringify(n)};return fetch(e,t).then(function(e){return e.json()})}}]),e}()}});