interface Array<T> {
    movesort(old_index: number, new_index: number): void;
    sum<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): number;
    optMake(
        value_item: (value: T, index: number, array: T[]) => string | number,
        label_item: (value: T, index: number, array: T[]) => string | number, thisArg?: any): SelectTextOptions[];
}

interface Number {
    floatSpot(pos: number): number
    divisor(num: number): number
}

interface Window {
    CallRefreshReportList(): void;
}

interface SignalR {
    HubFileState: any
}

interface WebSocket {
    ConnectionId: string
    SendMsg(message: any): void
}

declare function mlog(...args: any[]): any;