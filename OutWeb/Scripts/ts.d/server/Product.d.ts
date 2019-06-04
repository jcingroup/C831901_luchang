declare module server {
    interface Product {
        product_id?: string;
        product_sn?: string;
        product_name?: string;
        prodkind_id?: number;
        introduction?: any;
        standard?: any;
        state?: string;
        sort?: number;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        lang?: string;
        price?: number;
        is_home?: string;
        contenttext?: any;

        //擴充屬性
        kind_name?: string
        Detail?: Array<server.ProdItem>;
    }
}