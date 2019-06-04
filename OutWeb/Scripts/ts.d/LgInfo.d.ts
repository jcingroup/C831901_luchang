interface LoginInfo {
    login_id: string;
    en_login_id: string;//登錄Id
    login_type: string;//登錄身分別

    en_cust_id: string;//目前系統作操的 CustId
    cust_id: string; //編碼的CustId
    cust_name: string;//用戶全名
    enUrlCustId: string; //
}

declare let login_info: LoginInfo;//