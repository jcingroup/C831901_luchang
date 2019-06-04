declare module server {
    interface ProdItem {
        product_id?: string;
        item_no?: number;
        item_name?: string;
        price?: number;
        can_supply?: number;
        is_order?: number;
        save_stock?: number;
        edit_type?: any;
        item_state?: string;
    }
}