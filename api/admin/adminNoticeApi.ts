import { AdminNotice, AdminNoticeListResponse } from "@/types/admin";
import { AdminNoticeInputType } from "@/schemas/admin/adminSchema";
import axiosInstance from "@/api/axiosInstance";

export const adminNoticeApi = {
    getNoticeList: async (
        page: number = 1,
        size: number = 15,
    ): Promise<AdminNoticeListResponse> => {
        const response = await axiosInstance.get(`/admin/notice`, { params: { page, size } });
        return response.data.data;
    },

    getNoticeById: async (id: number): Promise<AdminNotice> => {
        const response = await axiosInstance.get(`/admin/notice/${id}`);
        return response.data.data;
    },

    createNotice: async (data: AdminNoticeInputType) => {
        const response = await axiosInstance.post(`/admin/notice`, data);
        return response.data.data;
    },

    updateNotice: async (id: number, data: AdminNoticeInputType) => {
        const response = await axiosInstance.patch(`/admin/notice/${id}`, data);
        return response.data.data;
    },

    deleteNotice: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/notice/${id}`);
        return response.data.data;
    },
};

export default adminNoticeApi;
