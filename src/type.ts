
export interface PoliciesData {
    date: string;
    article: {
        index?: number,
        english: {
            noborder?: boolean;
            title?: string;
            content?: string;
            table?: TableData[][];
        },
        korean: {
            noborder?: boolean;
            title?: string;
            content?: string;
            table?: TableData[][];
        }
    }[]
}

export interface TableData {
    content : string
    style: any
}