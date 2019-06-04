declare enum InfoType {
    Info,
    Warnning,
    Error
}

interface ErrDescription {
    field: string
    err: Array<ErrItem>
}
interface ErrItem {
    err_code: number
    message: string
}
interface PBase {

}
interface ResultBase {
    state?: number;
    message?: string;
    version?: string;
}
interface ReturnData<T> extends ResultBase {
    exist?: boolean;
    data?: T;
    //alert?: Array<ErrDescription>
}
interface ReturnUpdate<T> extends ResultBase {
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

interface CartResult extends ResultBase {
    amt: number
    total: number
    item: Array<CartResultItem>
}
interface CartResultItem {
    product_id?: string
    product_name?: string
    qty?: number
    price?: number
    sub_total?: number
    img_src?: string
}