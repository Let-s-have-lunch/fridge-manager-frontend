import axiosInstance from "../axiosInstance";
import { InquiryListResponseType, InquiryUserItemType } from "@/types/inquiry";

const adminInquiryApi = {
    // 1:1 문의 목록 조회 (/admin/inquiries/list 로 수정)
    fetchInquiryList: async (
        page: number = 1,
        size: number = 15,
    ): Promise<InquiryListResponseType> => {
        const response = await axiosInstance.get(`/admin/inquiry/list`, {
            params: { page, size },
        });
        return response.data.data;
    },

    // 1:1 문의 상세 조회
    fetchInquiryDetail: async (id: number): Promise<InquiryUserItemType> => {
        const response = await axiosInstance.get(`/admin/inquiry/${id}`);
        return response.data.data;
    },

    // 답변 등록/수정
    createOrUpdateAnswer: async (id: number, answer: string) => {
        const response = await axiosInstance.patch(`/admin/inquiry/${id}`, { answer });
        return response.data.data;
    },

    // 답변 삭제
    deleteAnswer: async (id: number) => {
        const response = await axiosInstance.delete(`/admin/inquiry/${id}`);
        return response.data.data;
    },
};

export default adminInquiryApi;
