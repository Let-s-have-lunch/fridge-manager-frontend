export interface PaginationResponseType<T> {
    page: number;
    size: number;
    total: number;
    list: T[];
}
