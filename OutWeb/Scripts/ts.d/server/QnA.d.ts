declare module server {
    interface QnA {
        qna_id?: any;
        qnakind_id?: number;
        qna_title?: string;
        qna_content?: any;
        sort?: number;
        state?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        lang?: string;
        //擴充屬性
        kind_name?: string
    }
}