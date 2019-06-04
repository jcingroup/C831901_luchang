declare enum InfoType {
    Info,
    Warnning,
    Error
}

//interface IResultBase {
//    state: number;
//    message: string;
//    append: any;
//}
//interface IResultData<T> extends IResultBase {
//    data: T;
//    exist: boolean
//}

interface ErrDescription {
    field: string
    err: Array<ErrItem>
}

interface ErrItem {
    err_code: number
    message: string
}

interface ReturnBase {
    state?: number;
    message?: string;
    append?: any;
}
interface ReturnData<T> extends ReturnBase {
    exist?: boolean;
    data?: T;
    alert?: Array<ErrDescription>
}
interface DetailQuery<T, T2> extends ReturnData<T> {
    detail: T2[]
}
interface ReturnUpdate<T> extends ReturnBase {
    id: number;
    exist: boolean;
    data: T;
    err_list: Array<ErrDescription>
}

interface GridInfo<T> {
    rows?: T[],
    total?: number,
    page?: number,
    records?: number,
    startcount?: number,
    endcount?: number,
    sort?: string, //asc desc
    field?: string
}

interface SerializeFile {
    guid?: string,
    iconPath?: string,
    originPath?: string,
    fileName?: string,
    fileKind?: string,
    isImage?: boolean,
    size?: number,
}
interface SerializeFileList {
    files?: Array<SerializeFile>,
    state?: number,
    filescope?: ImageUpScope
}

interface FilesUpScope {
    key?: string,
    description?: string,
    kind?: string,
    limitSize?: number,
    limitExtType?: Array<string>,
    allowExtType?: Array<string>,
    limitCount?: number,

}
interface ImageSizeParm {
    heigh?: number,
    width?: number,
    folderName?: string,
}
interface ImageUpScope extends FilesUpScope {
    keepOrigin?: boolean,
    description?: string,
    Parm?: Array<ImageSizeParm>
}

interface CartResult extends ReturnBase {
    amt: number
    total: number
    item: Array<CartResultItem>
}
interface CartResultItem {
    product_id?: string
    product_name?: string
    item_no?: number
    item_name?:string
    qty?: number
    price?: number
    sub_total?: number
    img_src?: string
}