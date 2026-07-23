import { ShoppingItem, ShoppingListInputType, ShoppingStatsSummary } from "../types/shoppingList";

const BASE_URL = "https://api.example.com"; // 실제 API 서버 주소로 변경

// 1. 특정 날짜 하루 치 목록 조회
export const getShoppingItems = async (
    userId: number,
    targetDate: string,
): Promise<ShoppingItem[]> => {
    const response = await fetch(`${BASE_URL}/shopping-list?userId=${userId}&date=${targetDate}`);
    if (!response.ok) throw new Error("목록을 불러오는데 실패했습니다.");
    return await response.json();
};

// 2. 달력 연동 대비: 시작일~종료일 기간별 목록 조회
export const getShoppingItemsByRange = async (
    userId: number,
    startDate: string,
    endDate: string,
): Promise<ShoppingItem[]> => {
    const response = await fetch(
        `${BASE_URL}/shopping-list/range?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
    );
    if (!response.ok) throw new Error("기간별 목록을 불러오는데 실패했습니다.");
    return await response.json();
};

// 3. 새로운 장보기 아이템 생성 (name, quantity, memo 데이터 완벽 전송)
export const createShoppingItem = async (
    userId: number,
    itemData: ShoppingListInputType,
): Promise<ShoppingItem> => {
    const response = await fetch(`${BASE_URL}/shopping-list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...itemData }),
    });
    if (!response.ok) throw new Error("아이템 생성에 실패했습니다.");
    return await response.json();
};

// 4. 기존 장보기 아이템 내용 수정
export const updateShoppingItem = async (
    userId: number,
    itemId: number,
    itemData: ShoppingListInputType,
): Promise<ShoppingItem> => {
    const response = await fetch(`${BASE_URL}/shopping-list/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...itemData }),
    });
    if (!response.ok) throw new Error("아이템 수정에 실패했습니다.");
    return await response.json();
};

// 5. 장보기 아이템 삭제
export const deleteShoppingItem = async (userId: number, itemId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/shopping-list/${itemId}?userId=${userId}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("아이템을 삭제하는데 실패했습니다.");
};

// 6. 체크 상태 토글 (완료/미완료 뒤집기)
export const toggleShoppingTodo = async (userId: number, itemId: number): Promise<ShoppingItem> => {
    const response = await fetch(`${BASE_URL}/shopping-list/${itemId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    if (!response.ok) throw new Error("상태 변경에 실패했습니다.");
    return await response.json();
};

// 🌟 7. [신규 확장] 하단 '통계' 탭 연동용 요약 데이터 조회 API
export const getShoppingStats = async (
    userId: number,
    targetDate: string,
): Promise<ShoppingStatsSummary> => {
    const response = await fetch(
        `${BASE_URL}/shopping-list/stats?userId=${userId}&date=${targetDate}`,
    );
    if (!response.ok) throw new Error("통계 데이터를 불러오는데 실패했습니다.");
    return await response.json();
};
