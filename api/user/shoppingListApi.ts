import axiosInstance from "@/api/axiosInstance";
import { ShoppingItem } from "@/types/shoppingList";

const getShoppingItems = async (date: string): Promise<ShoppingItem[]> => {
    // 백엔드에서 req.query.date 로 받으므로 params 에 넣어서 보냅니다.
    const response = await axiosInstance.get("/", { params: { date } });
    return response.data.data; // 백엔드가 { message, data } 형태로 주므로 data.data 리턴
};

// 2. 장보기 메모 생성 (POST /create)
const createShoppingItem = async (input: {
    memo: string;
    date: string;
}): Promise<ShoppingItem> => {
    const response = await axiosInstance.post("/create", input);
    return response.data.data;
};

// 3. 장보기 메모 수정 (PATCH /:id)
const updateShoppingItem = async (
    id: number,
    input: { memo: string; date: string },
): Promise<ShoppingItem> => {
    const response = await axiosInstance.patch(`/${id}`, input);
    return response.data.data;
};

// 4. 장보기 메모 삭제 (DELETE /:id)
const deleteShoppingItem = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/${id}`);
};

// 5. 체크 상태 토글 (PATCH /:id/toggle)
const toggleShoppingTodo = async (id: number): Promise<ShoppingItem> => {
    const response = await axiosInstance.patch(`/${id}/toggle`);
    return response.data.data;
};

export default {getShoppingItems, createShoppingItem, updateShoppingItem, deleteShoppingItem, toggleShoppingTodo};
