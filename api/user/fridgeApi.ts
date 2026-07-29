import axiosInstance from "@/api/axiosInstance";


export interface Fridge {
    id: number;
    userId: number;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const getFridgeList = async () => {
    const { data } = await axiosInstance.get<ApiResponse<Fridge[]>>("/fridge/list");
    return data.data;
};

export const createFridge = async (name: string) => {
    const { data } = await axiosInstance.post<ApiResponse<Fridge>>("/fridge", {
        name,
    });

    return data.data;
};

export const updateFridge = async (id: number, name: string) => {
    const { data } = await axiosInstance.patch<ApiResponse<Fridge>>(`/fridge/${id}`, {
        name,
    });

    return data.data;
};

export const deleteFridge = async (id: number) => {
    await axiosInstance.delete(`/fridge/${id}`);
};
