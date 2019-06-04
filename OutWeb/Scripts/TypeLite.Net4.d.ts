
 
 

 

/// <reference path="Enums.ts" />

declare namespace DotWeb.Controllers.CartController {
	interface CheckoutModal extends ProcCore.HandleResult.ResultBase {
		amt: number;
		CustInfo: ProcCore.Business.DB0.Purchase;
		DShip: DotWeb.Controllers.CartController.DShip[];
		OrderItem: DotWeb.Controllers.CartController.OrderItemInfo[];
        total: number;
        productTotal: number;
        TShip: DotWeb.Controllers.CartController.TShip[];
        AShip: DotWeb.Controllers.CartController.AShip[];
	}
	interface DShip extends DotWeb.Controllers.CartController.TShip {
		bank_charges: number;
	}
	interface OrderItemInfo {
        img_src: string;
        item_no: number;
        item_name: string;
		price: number;
		product_id: System.Guid;
		product_name: string;
		qty: number;
		sub_total: number;
	}
	interface ResSubmit {
		cardcode: string;
		iscard: boolean;
		no: string;
	}
	interface TShip {
		id: number;
		limit_money: number;
		shipment_fee: number;
    }
    interface AShip {
        id: number;
        LessThanQty: number;
        shipment_fee: number;
    }
}
declare namespace DotWeb.Verify {
	interface ErrDescription {
		err: DotWeb.Verify.ErrItem[];
		field: string;
	}
	interface ErrItem {
		err_code: number;
		message: string;
	}
}
declare namespace DotWeb.WebApp.Models.JsonCartParam {
	interface CartParam {
		field: string;
		key: string;
		sort: string;
		value: any;
		valuetype: string;
	}
	interface CartParamGroup {
		Gkey: string;
		List: DotWeb.WebApp.Models.JsonCartParam.CartParam[];
		title: string;
		titleCss: string;
	}
}
declare namespace DotWeb.WebApp.Models.JsonWebParam {
	interface WebParam {
		field: string;
		key: string;
		sort: string;
		type: string;
		value: any;
		valuetype: string;
	}
}

declare namespace DotWeb.WebApp.Models.JsonEditorParam {
    interface EditorParam {
        key: string;
        content: string;
        title: string;
    }
}
declare namespace ProcCore.Business.DB0 {
	interface Customer {
		address: string;
		birthday: Date;
		c_name: string;
		c_pw: string;
		customer_id: System.Guid;
		email: string;
		gender: string;
		ins_date: Date;
		ins_id: string;
		lang: string;
		mobile: string;
		Purchase: ProcCore.Business.DB0.Purchase[];
		state: string;
		tel: string;
		upt_date: Date;
		upt_id: string;
		zip: string;
	}
	interface ProdKind {
		kind_name: string;
		prodkind_id: number;
		Product: ProcCore.Business.DB0.Product[];
		sort: number;
		state: string;
	}
	interface Product {
		ins_date: Date;
		ins_id: string;
		introduction: string;
		is_home: string;
		lang: string;
		price: number;
		ProdKind: ProcCore.Business.DB0.ProdKind;
		prodkind_id: number;
		product_id: System.Guid;
		product_name: string;
		product_sn: string;
		PurchaseDetail: ProcCore.Business.DB0.PurchaseDetail[];
		sort: number;
		standard: string;
		state: string;
		upt_date: Date;
		upt_id: string;
	}
	interface Purchase {
		bank_charges: number;
		cancel_reason: string;
		Customer: ProcCore.Business.DB0.Customer;
		customer_id: System.Guid;
		discount: number;
		discount_memo: string;
		identification: string;
		invoice_address: string;
		letterhead: string;
		link_guid: System.Guid;
		order_date: Date;
		pay_state: string;
		pay_type: string;
		purchase_no: string;
		PurchaseDetail: ProcCore.Business.DB0.PurchaseDetail[];
		receive_address: string;
		receive_email: string;
		receive_is_on_holiday: boolean;
		receive_memo: string;
		receive_mobile: string;
		receive_name: string;
		receive_tel: string;
		receive_time: string;
		receive_zip: string;
		remit_date: Date;
		remit_memo: string;
		remit_money: number;
		remit_no: string;
		ship_date: Date;
		ship_fee: number;
		ship_state: string;
		source: string;
		state: string;
		total: number;
	}
	interface PurchaseDetail {
		img_src: string;
        item: number;
        item_name: string;
		price: number;
		Product: ProcCore.Business.DB0.Product;
		product_id: System.Guid;
		Purchase: ProcCore.Business.DB0.Purchase;
		purchase_no: string;
		qty: number;
		state: string;
		sub_total: number;
	}
}
declare namespace ProcCore.HandleResult {
	interface ResultBase {
		append: any;
		err_list: DotWeb.Verify.ErrDescription[];
		message: string;
		state: number;
	}
}
declare namespace System {
	interface Guid {
	}
}


