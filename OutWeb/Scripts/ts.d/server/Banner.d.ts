declare module server {
    interface Banner {
        banner_id?: any;
        banner_name?: string;
        type?: string;
        sort?: number;
        state?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        //擴充屬性
        edit_type?: IEditType;
    }
}