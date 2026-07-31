import {
    AdminUserListResponse,
    DashboardSummaryResponse,
    AdminUser,
    AdminNotice,
    AdminNoticeListResponse,
} from "@/types/admin";
import { AdminUpdateUserInputType, AdminNoticeInputType } from "@/schemas/admin/adminSchema";
import axiosInstance from "@/api/axiosInstance";

export const adminApi = {
    getSummary: async (): Promise<DashboardSummaryResponse> => {
        const response = await axiosInstance.get(`/admin/summary`);
        return response.data.data;
    },

    getUserList: async (page: number = 1, size: number = 15): Promise<AdminUserListResponse> => {
        const response = await axiosInstance.get(`/admin/user/list`, { params: { page, size } });
        return response.data.data;
    },

    getUserDetail: async (id: number): Promise<AdminUser> => {
        const response = await axiosInstance.get(`/admin/user/${id}`);
        return response.data.data;
    },

    updateUser: async (id: number, data: AdminUpdateUserInputType) => {
        const response = await axiosInstance.patch(`/admin/user/${id}`, data);
        return response.data.data;
    },

    deleteUser: async (id: number) => {
        const response = await axiosInstance.patch(`/admin/user/${id}/delete`);
        return response.data.data;
    },

    getNoticeList: async (
        page: number = 1,
        size: number = 15,
    ): Promise<AdminNoticeListResponse> => {
        const response = await axiosInstance.get(`/admin/notice`, { params: { page, size } });
        return response.data.data;
    },

    // ✅ 공지사항 상세 조회 추가
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

export default adminApi;
