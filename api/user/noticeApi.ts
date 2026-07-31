import axiosInstance from "../axiosInstance";

export interface NoticeItem {
    id: number;
    title: string;
    createdAt: string;
}

export interface NoticeDetailType extends NoticeItem {
    content: string;
}

const noticeApi = {
    // 공지사항 목록 조회
    fetchNotices: async (): Promise<NoticeItem[]> => {
        const response = await axiosInstance.get("/notices/list");
        const result = response.data.data || response.data;
        if (Array.isArray(result)) return result;
        return result?.list || result?.notices || [];
    },

    // 공지사항 상세 조회 (응답 구조 유연하게 대응)
    fetchNoticeDetail: async (id: number): Promise<NoticeDetailType> => {
        const response = await axiosInstance.get(`/notices/${id}`);
        const result = response.data.data || response.data;
        return result;
    },
};

export default noticeApi;
