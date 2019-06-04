declare module server {
    interface LogAccount {
        account?: string
        log_pwd?: string
        log_name?: string
        def_pwd?: string
        role_id?: string
        email?: string
        state?: string
        last_login?: any
        LogRole?: server.LogRole

    }
}