//Select
interface SelectTextOptions {
    label: string;
    value: any;
    sort?: number;
    is_active?: boolean;
    sub?: SelectTextOptions[]
}

interface AutoSelectOptions {
    id: any, name: any
}