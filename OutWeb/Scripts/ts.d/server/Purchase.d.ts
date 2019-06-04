declare module server {
    interface Purchase {
        purchase_no?: string;
        order_date?: Date;

        ship_date?: Date;
        cancel_reason?: string;
        total?: any;
        ship_fee?: any;
        bank_charges?: any;
        discount?: any;
        discount_memo?: string;
        receive_email?: string;
        receive_name?: string;
        receive_tel?: string;
        receive_mobile?: string;
        receive_zip?: string;
        receive_address?: string;
        receive_memo?: string;
        remit_no?: string;
        remit_date?: Date;
        remit_money?: any;
        remit_memo?: string;
        customer_id?: any;

        pay_type?: string;
        pay_state?: string;
        ship_state?: string;
        state?: string;
        source?: string;

        receive_time?: string;
        receive_is_on_holiday?: boolean;
        identification?: string;
        letterhead?: string;
        invoice_address?: string;

        //擴充屬性
        PurchaseDetail?: Array<PurchaseDetail>;
        is_mail?: boolean;
        up_ship?: boolean;
    }
}