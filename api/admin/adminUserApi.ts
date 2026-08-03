import { AdminUserListResponse, DashboardSummaryResponse, AdminUser } from "@/types/admin";
import { AdminUpdateUserInputType } from "@/schemas/admin/adminSchema";
import axiosInstance from "@/api/axiosInstance";

export const adminUserApi = {
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
};

export default adminUserApi;
