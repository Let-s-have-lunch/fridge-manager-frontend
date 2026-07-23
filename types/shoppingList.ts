// 기본 장보기 아이템 타입 (userId 선택사항 추가)
export interface ShoppingItem {
    id: number;
    userId?: number;
    memo: string;
    date: string; // 예: "2026-07-23"
    isChecked: boolean; // 체크 완료 여부
}

// 아이템 생성/수정용 입력 타입
export interface ShoppingListInputType {
    memo: string;
    date: string;
}

// 🌟 [미래 대비 확장] 나중에 달력에서 특정 기간(시작일~종료일)의 목록을 한 번에 불러올 때 쓸 타입!
export interface ShoppingDateRangeQuery {
    startDate: string; // 예: "2026-07-01"
    endDate: string; // 예: "2026-07-31"
}
