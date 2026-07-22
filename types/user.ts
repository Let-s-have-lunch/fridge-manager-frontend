export const Role = {
    USER: "USER",
    ADMIN: "ADMIN",
};

export type RoleType = (typeof Role)[keyof typeof Role];

export interface User {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    nickname: string;
    password: string;
    birthdate: string | null;
    email: string;
    role: RoleType;
}
