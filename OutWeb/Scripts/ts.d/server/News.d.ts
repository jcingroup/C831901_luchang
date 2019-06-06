﻿declare module server {
    interface News {
        news_id?: any;
        news_title?: string;
        news_author?: string;
        news_numberX?: number;
        news_numberY?: number;
        news_total?: number;
        day?: any;
        news_content?: any;
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