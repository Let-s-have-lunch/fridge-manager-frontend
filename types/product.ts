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
    discarded: "DISCARD",
}

export type StatusType = (typeof Status)[keyof typeof Status];

export interface Product {
    id: number;
    name: string;
    memo: string | null;

    quantity: number;
    unit: UnitType;
    storageType: StorageType;

    expirationDate: string;
    createdAt: string;
    dDay: number;

    price: number | null;
    addMethod: AddMethodType;
    status: StatusType;
}
