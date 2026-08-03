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

// 2. 대시보드 관련 타입
export interface DashboardSummaryResponse {
    recentUsers: Pick<AdminUser, "id" | "nickname" | "email" | "role" | "createdAt">[];
}

// 3. 공지사항 관련 타입
export interface AdminNotice {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

// 4. 공통 페이지네이션 타입
export interface PaginationResponse<T> {
    page: number;
    size: number;
    total: number;
    list: T[];
}

// 5. 목록 응답 타입들 재사용 (여기서 중복 선언을 해결합니다)
export type AdminUserListResponse = PaginationResponse<AdminUser>;
export type AdminNoticeListResponse = PaginationResponse<AdminNotice>;
