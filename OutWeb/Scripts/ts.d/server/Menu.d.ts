declare module server {
    interface Menu {
        Id?: string;
        Link?: string;
        Items?: Array<Menu>;
        Active?: boolean;
        CultureName?: Array<CultureKeyValue>;
        ClickMode?: "Down" | "Right" | "None";
        ItemName?: string;
        DataGlyph?: string;
        ClassName?:string;
        ClassNameH3?:string;
        PathStrace?: Array<string>
        //擴充
        role_array?: Array<LogRole>
    }

    interface CultureKeyValue {
        Culture: string
        Text: string
    }
}