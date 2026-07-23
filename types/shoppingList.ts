// 기본 장보기 아이템 타입
export interface ShoppingItem {
    id: number;
    userId?: number;
    memo: string; // 전체 메모 (기존 호환용, 예: "무 1개")
    name?: string; // 🌟 [확장] 식재료 이름 (예: "무")
    quantity?: string; // 🌟 [확장] 수량 (예: "1개")
    category?: string; // 🌟 [미래 확장] 카테고리 (예: "채소", "정육" 등 추후 분류/통계용)
    date: string; // 예: "2026-07-23"
    isChecked: boolean; // 체크 완료 여부
}

// 아이템 생성/수정용 입력 타입
export interface ShoppingListInputType {
    memo: string;
    name?: string;
    quantity?: string;
    category?: string;
    date: string;
}

// 🌟 [미래 대비 확장] 나중에 달력에서 특정 기간(시작일~종료일)의 목록을 한 번에 불러올 때 쓸 타입
export interface ShoppingDateRangeQuery {
    startDate: string; // 예: "2026-07-01"
    endDate: string; // 예: "2026-07-31"
}

// 🌟 [미래 대비 확장] 통계 화면(하단 탭 '통계') 연동용 요약 타입
export interface ShoppingStatsSummary {
    totalCount: number; // 전체 장보기 항목 수
    checkedCount: number; // 완료(체크)한 항목 수
    completionRate: number; // 달성률 (%)
}
