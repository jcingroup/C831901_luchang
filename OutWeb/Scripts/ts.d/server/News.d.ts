declare module server {
    interface News {
        news_id?: any;
        news_title?: string;
        day?: any;
        news_content?: any;
        sort?: number;
        state?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        lang?: string;
        is_home?: string;
        //擴充屬性
    }
}