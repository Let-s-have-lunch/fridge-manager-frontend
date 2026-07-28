import axiosInstance from "@/api/axiosInstance";
import { ShoppingItem, ShoppingItemPayload } from "@/types/shoppingList";

const getShoppingItems = async (date: string): Promise<ShoppingItem[]> => {
    const response = await axiosInstance.get("/shopping-list", { params: { date } });
    return response.data.data;
};

const createShoppingItem = async (input: ShoppingItemPayload): Promise<ShoppingItem> => {
    const response = await axiosInstance.post("/shopping-list/create", input);
    return response.data.data;
};

const updateShoppingItem = async (
    id: number,
    input: ShoppingItemPayload,
): Promise<ShoppingItem> => {
    const response = await axiosInstance.patch(`/shopping-list/${id}`, input);
    return response.data.data;
};

const deleteShoppingItem = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/shopping-list/${id}`);
};

const toggleShoppingTodo = async (id: number): Promise<ShoppingItem> => {
    const response = await axiosInstance.patch(`/shopping-list/${id}/toggle`);
    return response.data.data;
};

export default {getShoppingItems, createShoppingItem, updateShoppingItem, deleteShoppingItem, toggleShoppingTodo};
