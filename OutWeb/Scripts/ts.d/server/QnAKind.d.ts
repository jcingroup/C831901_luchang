declare module server {
    interface QnAKind {
        qnakind_id?: number;
        kind_name?: string;
        sort?: number;
        state?: string;
        preface?: string;
        //擴充屬性
    }
}