export interface InquiryUserItemType {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    user: {
        id: number;
        nickname: string;
    };
    answer?: {
        id: number;
        content: string;
        createdAt: string;
    } | null;
}

export interface InquiryListResponseType {
    list: InquiryUserItemType[];
    total: number;
}

export interface InquiryAnswerRequestType {
    content: string;
}
