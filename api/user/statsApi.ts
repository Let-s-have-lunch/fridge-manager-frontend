import axiosInstance from "@/api/axiosInstance";
import { GetStatisticsResponse } from "@/types/statistic";

const getStatistics = async (year: string, month: string): Promise<GetStatisticsResponse> => {
    const response = await axiosInstance.get("/statistics", {
        params: {
            year,
            month,
        },
    });
    return response.data.data;
};

export default { getStatistics };