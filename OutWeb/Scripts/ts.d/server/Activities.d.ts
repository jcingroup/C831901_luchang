declare module server {
    interface Activities {
        activities_id?: any;
        activities_title?: string;
        day?: any;
        activities_content?: any;
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