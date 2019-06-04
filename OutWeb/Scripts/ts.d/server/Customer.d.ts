declare module server {
    interface Customer {
        customer_id?: any;
        email?: string;
        c_pw?: string;
        c_name?: string;
        gender?: string;
        tel?: string;
        mobile?: string;
        zip?: string;
        address?: string;
        birthday?: string;
        state?: string;
        ins_id?: string;
        ins_date?: Date;
        upt_id?: string;
        upt_date?: Date;
        lang?: string;
    }
}