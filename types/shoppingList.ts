export interface ShoppingItem {
    id: number;
    userId?: number;
    memo: string; // 할 일 내용 (예: "오이오이")
    category?: string; // 카테고리 (선택)
    date: string; // 날짜 및 시간 (예: "26.07.08 pm 08:59" 또는 "2026-07-01")
    isChecked: boolean; // 체크 완료 여부
    order?: number; // 정렬 순서
}

export interface ShoppingListInputType {
    memo: string;
    category?: string;
    date: string;
    order?: number;
}

export interface ShoppingDateRangeQuery {
    startDate: string;
    endDate: string;
}

export interface ShoppingStatsSummary {
    totalCount: number;
    checkedCount: number;
    completionRate: number;
    categoryBreakdown?: { [category: string]: number };
}
