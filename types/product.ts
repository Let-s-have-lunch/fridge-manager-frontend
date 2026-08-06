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

export const AddMethod = {
    manual: "MANUAL",
    receipt: "RECEIPT",
}

export type AddMethodType = (typeof AddMethod)[keyof typeof AddMethod];

export const Status = {
    stored: "STORED",
    consumed: "CONSUMED",
    discarded: "DISCARDED",
}

export type StatusType = (typeof Status)[keyof typeof Status];

// 1. 📝 기본 식재료 타입 (상세 조회 - getProductById 응답용)
// 백엔드 원본 데이터와 100% 일치 (dDay 없음)
export interface ProductDetail {
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
    categoryId: number; // 👈 카테고리 ID 컬럼 추가!
    category: Category;
}

// 2. 📋 목록용 식재료 타입 (목록 조회 - getProductList 응답용)
// 기본 타입(ProductDetail)의 모든 속성을 그대로 물려받고, dDay만 추가!
export interface ProductListItem extends ProductDetail {
    dDay: number;
}

// 3. ✍️ 등록/수정용 폼 타입 (생성/수정 페이로드용)
// 카테고리 객체(category)를 빼고, 숫자 형태의 categoryId를 넣음
export interface ProductPayload extends Omit<ProductDetail, "id" | "createdAt" | "category"> {
    categoryId: number;
}