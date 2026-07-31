import axiosInstance from "../axiosInstance";

const inquiryApi = {
    // 내 1:1 문의 목록 조회
    fetchMyInquiries: async () => {
        const response = await axiosInstance.get("/inquiries/list");
        const result = response.data.data || response.data;
        if (Array.isArray(result)) return result;
        return result?.list || result?.inquiries || [];
    },

    // 1:1 문의 상세 조회
    fetchInquiryDetail: async (id: number) => {
        const response = await axiosInstance.get(`/inquiries/${id}`);
        return response.data.data || response.data;
    },

    // 1:1 문의 작성
    createInquiry: async (data: { title: string; content: string }) => {
        const response = await axiosInstance.post("/inquiries/create", data);
        return response.data.data || response.data;
    },
};

export default inquiryApi;
