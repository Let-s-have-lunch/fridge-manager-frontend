import axiosInstance from "@/api/axiosInstance";
import { Fridge } from "@/types/fridge";
import { FridgeInputType } from "@/schemas/user/createFridgeSchema";


const getFridgeList = async (): Promise<Fridge[]> => {
    const response = await axiosInstance.get("/fridges");
    return response.data.data;
};

const createFridge = async (input: FridgeInputType ): Promise<Fridge> => {
    const response = await axiosInstance.post("/fridges/create", input);
    return response.data.data;
};

const updateFridge = async (id: number, input: FridgeInputType): Promise<Fridge> => {
    const response = await axiosInstance.patch(`/fridges/${id}`, input);
    return response.data.data;
};

const deleteFridge = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/fridges/${id}`);
};

export default {
    getFridgeList,
    createFridge,
    updateFridge,
    deleteFridge,


}