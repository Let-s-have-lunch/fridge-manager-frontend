import axiosInstance from "../axiosInstance";
import { PaginationResponseType } from "@/types/common";
import { Notice } from "@/types/notice";

const getNoticeList = async (
    page: number = 1,
    size: number = 15,
): Promise<PaginationResponseType<Notice>> => {
    const response = await axiosInstance.get("/notices/list", {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getNoticeById = async (id: number): Promise<Notice> => {
    const response = await axiosInstance.get(`/notices/${id}`);
    return response.data.data;
};

export default { getNoticeList, getNoticeById };
