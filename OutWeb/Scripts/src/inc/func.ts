import { stdNumber } from '../../comm/comm-func';
import { fetchGet, fetchPost } from '../../comm/ajax';

export var CartProxy =
{
    Set: function (product_id, qty) {
        return fetchPost<ResultBase>(gb_approot + 'Cart/Add', { id: product_id, qty });
    },
    Info: function () {
        return fetchGet<CartResult>(gb_approot + 'Cart/Info', {});
    },
    Del: function (product_id) {
        return fetchGet<ResultBase>(gb_approot + 'Cart/Del', { product_id: product_id });
    },
    Check: function () {
        return fetchGet<any>(gb_approot + 'Cart/Check', {});
    },
    Submit: function (data) {
        return fetchPost<ResultBase>(gb_approot + 'Cart/Submit', { master: data });
    }
}
export var MemberProxy = {
    Regist: function (data) {
        return fetchPost<ResultBase>(gb_approot + 'Member/Register', data);
    },
    Login: function (data) {
        return fetchPost<ResultBase>(gb_approot + 'Member/loginCheck', data);
    }
}