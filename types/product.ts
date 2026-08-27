import { Category } from "@/types/category";

export const Storage = {
    refrigerated: "REFRIGERATED",
    frozen: "FROZEN",
    room_temp: "ROOM_TEMP",
};

export type StorageType = (typeof Storage)[keyof typeof Storage];

export const Unit = {
    ea: "EA",
    g: "G",
    kg: "KG",
    ml: "ML",
    l: "L",
};

export type UnitType = (typeof Unit)[keyof typeof Unit];

export const Status = {
    stored: "STORED",
    consumed: "CONSUMED",
    discarded: "DISCARDED",
}

export type StatusType = (typeof Status)[keyof typeof Status];

export interface Product {
    id: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    memo: string | null;
    storageType: StorageType;
    quantity: number;
    unit: UnitType;
    price: number | null;
    expirationDate: string;
    status: StatusType;
    fridgeId: number;   // 👈 냉장고 ID 컬럼 추가!
    categoryId?: number; // 👈 카테고리 ID 컬럼 추가!
}

export type ProductCategory = Pick<Category, "id" | "name" | "icon">;

export interface ProductDetailItemType extends Product {
    category: ProductCategory;
}

export interface ProductListItemType extends Pick<
    Product,
    "id" | "createdAt" | "name" | "memo" | "storageType" | "quantity" | "unit" | "expirationDate"
> {
    dDay: number;
    category: ProductCategory;
}


