// 1. 유저 관련 타입
export type RoleType = "USER" | "ADMIN";

export interface AdminUser {
    id: number;
    email: string;
    nickname: string;
    role: RoleType;
    birthdate?: string | null;
    createdAt: string;
    deletedAt?: string | null;
}

export interface AdminUserListResponse {
    page: number;
    size: number;
    total: number;
    list: AdminUser[];
}

// 2. 대시보드 관련 타입
export interface DashboardSummaryResponse {
    recentUsers: Pick<AdminUser, "id" | "nickname" | "email" | "role" | "createdAt">[];
}

// 3. 공지사항 관련 타입 (기존 Notice 타입을 확장하거나 재사용)
export interface AdminNotice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdminNoticeListResponse {
    page: number;
    size: number;
    total: number;
    list: AdminNotice[];
}
