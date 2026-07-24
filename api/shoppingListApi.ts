import { ShoppingItem, ShoppingListInputType, ShoppingStatsSummary } from "../types/shoppingList";

const BASE_URL = "https://api.example.com"; // 실제 API 서버 주소로 변경

// 💡 [공통 헬퍼] API 응답 에러를 안전하게 처리하는 함수
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API 요청 실패 (상태 코드: ${response.status})`);
    }
    // 응답 본문이 없는 경우(204 No Content 등) 처리
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

// 1. 특정 날짜 하루 치 목록 조회
export const getShoppingItems = async (
    userId: number,
    targetDate: string,
): Promise<ShoppingItem[]> => {
    const response = await fetch(`${BASE_URL}/shopping-list?userId=${userId}&date=${targetDate}`, {
        headers: { Accept: "application/json" },
    });
    return await handleResponse(response);
};

// 2. 달력 연동 대비: 시작일~종료일 기간별 목록 조회
export const getShoppingItemsByRange = async (
    userId: number,
    startDate: string,
    endDate: string,
): Promise<ShoppingItem[]> => {
    const response = await fetch(
        `${BASE_URL}/shopping-list/range?userId=${userId}&startDate=${startDate}&endDate=${endDate}`,
        { headers: { Accept: "application/json" } },
    );
    return await handleResponse(response);
};

// 3. 새로운 장보기 아이템 생성 (name, quantity, memo 데이터 완벽 전송)
export const createShoppingItem = async (
    userId: number,
    itemData: ShoppingListInputType,
): Promise<ShoppingItem> => {
    const response = await fetch(`${BASE_URL}/shopping-list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ userId, ...itemData }),
    });
    return await handleResponse(response);
};

// 4. 기존 장보기 아이템 내용 수정
export const updateShoppingItem = async (
    userId: number,
    itemId: number,
    itemData: ShoppingListInputType,
): Promise<ShoppingItem> => {
    const response = await fetch(`${BASE_URL}/shopping-list/${itemId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ userId, ...itemData }),
    });
    return await handleResponse(response);
};

// 5. 장보기 아이템 단건 삭제
export const deleteShoppingItem = async (userId: number, itemId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/shopping-list/${itemId}?userId=${userId}`, {
        method: "DELETE",
    });
    await handleResponse(response);
};

// 6. 체크 상태 토글 (완료/미완료 뒤집기)
export const toggleShoppingTodo = async (userId: number, itemId: number): Promise<ShoppingItem> => {
    const response = await fetch(`${BASE_URL}/shopping-list/${itemId}/toggle`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ userId }),
    });
    return await handleResponse(response);
};

// 🌟 7. [1.PNG 갬성 확장] 완료(체크)된 아이템 한 번에 싹 비우기 (일괄 삭제)
export const deleteCompletedShoppingItems = async (
    userId: number,
    targetDate: string,
): Promise<void> => {
    const response = await fetch(
        `${BASE_URL}/shopping-list/completed?userId=${userId}&date=${targetDate}`,
        { method: "DELETE" },
    );
    await handleResponse(response);
};

// 🌟 8. [편의 기능 확장] 특정 날짜의 장보기 목록 전체 체크 / 전체 해제
export const toggleAllShoppingItems = async (
    userId: number,
    targetDate: string,
    isChecked: boolean,
): Promise<ShoppingItem[]> => {
    const response = await fetch(`${BASE_URL}/shopping-list/toggle-all`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({ userId, date: targetDate, isChecked }),
    });
    return await handleResponse(response);
};

// 🌟 9. [하단 탭 확장] '통계' 탭 연동용 요약 데이터 조회 API
export const getShoppingStats = async (
    userId: number,
    targetDate: string,
): Promise<ShoppingStatsSummary> => {
    const response = await fetch(
        `${BASE_URL}/shopping-list/stats?userId=${userId}&date=${targetDate}`,
        { headers: { Accept: "application/json" } },
    );
    return await handleResponse(response);
};
