declare module server {
    interface Spot {
        spot_id?: any;
        spot_title?: string;
        spot_content?: any;
        sort?: number;
        state?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        lang?: string;
        //擴充屬性
    }
}