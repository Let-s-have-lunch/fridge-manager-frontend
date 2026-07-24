// 기본 장보기 아이템 타입
export interface ShoppingItem {
    id: number;
    userId?: number;
    memo: string; // 전체 메모 (기존 호환용, 예: "무 1개")
    name?: string; // 🌟 [1_3.PNG UI 핵심] 식재료 이름 (예: "무") -> 왼쪽 체크박스 옆 정렬
    quantity?: string; // 🌟 [1_3.PNG UI 핵심] 수량 (예: "1개") -> 오른쪽 끝 정렬
    category?: string; // 🌟 [미래 확장] 카테고리 (예: "채소", "정육", "유제품")
    date: string; // 예: "2026-07-23"
    isChecked: boolean; // 체크 완료 여부
    order?: number; // 🌟 [웹앱 고도화] 리스트 정렬 순서 (추후 마우스 드래그 앤 드롭 순서 변경 대비)
}

// 아이템 생성/수정용 입력 타입
export interface ShoppingListInputType {
    memo: string;
    name?: string;
    quantity?: string;
    category?: string;
    date: string;
    order?: number;
}

// 🌟 [미래 대비 확장] 달력에서 특정 기간(시작일~종료일)의 목록을 한 번에 불러올 때 쓸 타입
export interface ShoppingDateRangeQuery {
    startDate: string; // 예: "2026-07-01"
    endDate: string; // 예: "2026-07-31"
}

// 🌟 [하단 '통계' 탭 연동용] 장보기 통계 요약 및 분석 타입
export interface ShoppingStatsSummary {
    totalCount: number; // 전체 장보기 항목 수
    checkedCount: number; // 완료(체크)한 항목 수
    completionRate: number; // 달성률 (%)
    // 🌟 [신규 추가] 카테고리별 구매 비율 (예: { "채소": 5, "정육": 2 }) -> 통계 탭 원형 차트 그리기용!
    categoryBreakdown?: { [category: string]: number };
}
