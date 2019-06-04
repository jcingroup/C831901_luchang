declare module server {
    interface AppProcess {
        process_id?: any;
        title?: string;
        info?: string;
        sort?: number;
        state?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        //擴充屬性
    }
}