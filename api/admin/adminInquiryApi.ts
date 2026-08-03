import axiosInstance from "../axiosInstance";
import { Inquiry, InquiryUserItemType } from "@/types/inquiry";
import { PaginationResponseType } from "@/types/common";

const adminInquiryApi = {
    fetchInquiryList: async (
        page: number = 1,
        size: number = 15,
    ): Promise<PaginationResponseType<InquiryUserItemType>> => {
        const response = await axiosInstance.get(`/admin/inquiries/list`, {
            params: { page, size },
        });
        return response.data.data;
    },

    // 1:1 문의 상세 조회
    fetchInquiryDetail: async (id: number): Promise<InquiryUserItemType> => {
        const response = await axiosInstance.get(`/admin/inquiries/${id}`);
        return response.data.data;
    },

    // 답변 등록/수정
    createOrUpdateAnswer: async (id: number, answer: string): Promise<Inquiry> => {
        const response = await axiosInstance.patch(`/admin/inquiries/${id}`, { answer });
        return response.data.data;
    },

    // 답변 삭제
    deleteAnswer: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/inquiries/${id}`);
        return response.data.data;
    },
};

export default adminInquiryApi;
