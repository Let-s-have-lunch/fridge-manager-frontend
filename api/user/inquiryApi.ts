import { PaginationResponseType } from "@/types/common";
import { Inquiry, InquiryUserItemType } from "@/types/inquiry";
import axiosInstance from "@/api/axiosInstance";
import { InquiryInputType } from "@/schemas/inquiry/inquirySchema";

const fetchMyInquiryList = async (
    page: number,
    size: number,
): Promise<PaginationResponseType<InquiryUserItemType>> => {
    const response = await axiosInstance.get("/inquiries/list", {
        params: {
            page,
            size,
        },
    });
    return response.data.data;
};

const getMyInquiryById = async (inquiryId: number): Promise<InquiryUserItemType> => {
    const response = await axiosInstance.get(`/inquiries/${inquiryId}`);
    return response.data.data;
};

const createInquiry = async (input: InquiryInputType): Promise<Inquiry> => {
    const response = await axiosInstance.post("/inquiries/create", input);
    return response.data.data;
};

const updateInquiry = async (inquiryId: number, input: InquiryInputType): Promise<Inquiry> => {
    const response = await axiosInstance.patch(`/inquiries/${inquiryId}`, input);
    return response.data.data;
};

const deleteInquiry = async (inquiryId: number): Promise<void> => {
    await axiosInstance.delete(`/inquiries/${inquiryId}`);
};

export default {
    fetchMyInquiryList,
    getMyInquiryById,
    createInquiry,
    updateInquiry,
    deleteInquiry,
};
