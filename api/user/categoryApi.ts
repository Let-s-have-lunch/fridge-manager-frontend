
import axiosInstance from "@/api/axiosInstance";
import { CategoryInputType } from "@/schemas/user/createCategorySchema";
import { Category } from "@/types/category";

const getCategoryList = async (): Promise<Category[]> => {
    const response = await axiosInstance.get(`/categories`);
    return response.data.data;
};

const createCategory = async (input: CategoryInputType): Promise<Category> => {
    const response = await axiosInstance.post(`/categories`, input);
    return response.data.data;
};

const updateCategory = async (categoryId: number, input: CategoryInputType): Promise<Category> => {
    const response = await axiosInstance.put(`/categories/${categoryId}`, input);
    return response.data.data;
};

const deleteCategory = async (categoryId: number): Promise<void> => {
    await axiosInstance.delete(`/categories/${categoryId}`);
};

export default {
    getCategoryList,
    createCategory,
    updateCategory,
    deleteCategory,
};
