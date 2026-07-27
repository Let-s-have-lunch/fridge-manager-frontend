import { ShoppingItem, ShoppingListInputType, ShoppingStatsSummary } from "../types/shoppingList";

const BASE_URL = "https://api.example.com";

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API 요청 실패 (상태 코드: ${response.status})`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : null;
};

export const getShoppingItems = async (
    userId: number,
    targetDate: string,
): Promise<ShoppingItem[]> => {
    const response = await fetch(`${BASE_URL}/shopping-list?userId=${userId}&date=${targetDate}`, {
        headers: { Accept: "application/json" },
    });
    return await handleResponse(response);
};

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

export const deleteShoppingItem = async (userId: number, itemId: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/shopping-list/${itemId}?userId=${userId}`, {
        method: "DELETE",
    });
    await handleResponse(response);
};

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
