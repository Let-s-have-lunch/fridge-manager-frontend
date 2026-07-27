export interface ShoppingItem {
    id: number;
    memo: string;
    date: string;
    isChecked: boolean;
    userId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface ShoppingListInputType {
    memo: string;
    date: string;
}