declare module server {
    interface PurchaseDetail {
        purchase_no?: string;
        item?: number;
        item_no?: number;
        product_id?: any;
        qty?: number;
        price?: any;
        sub_total?: any;
        state?: string;

        //擴充屬性
        product_sn?: string;
        product_name?: string;
        item_name?: string;
        kind_name?: string;
    }
}