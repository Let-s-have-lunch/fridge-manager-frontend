import axiosInstance from "@/api/axiosInstance";
import { Product } from "@/types/product";
import { ProductInputType } from "@/schemas/productSchema";

export interface GetProductListParams {
    fridgeId: number;
    sort?: "expire" | "category";
    keyword?: string;
}

// 제품 목록 조회
export const getProductList = async ({
    fridgeId,
    sort,
    keyword,
}: GetProductListParams): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/fridge/${fridgeId}`, {
        params: {
            sort,
            keyword,
        },
    });

    return response.data.data;
};

// 제품 상세 조회
export const getProductById = async (productId: number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${productId}`);

    return response.data.data;
};

// 제품 등록
export const createProduct = async (
    fridgeId: number,
    input: ProductInputType,
): Promise<Product> => {
    const response = await axiosInstance.post(`/products/fridge/${fridgeId}`, input);

    return response.data.data;
};

// 제품 수정
export const updateProduct = async (
    productId: number,
    input: ProductInputType,
): Promise<Product> => {
    const response = await axiosInstance.patch(`/products/${productId}`, input);

    return response.data.data;
};

// 제품 삭제
export const deleteProduct = async (productId: number): Promise<void> => {
    await axiosInstance.delete(`/products/${productId}`);
};

// 영수증 OCR 등록
export const createProductsByReceipt = async (
    fridgeId: number,
    receiptImage: File | Blob,
): Promise<Product[]> => {
    const formData = new FormData();

    formData.append("receiptImage", receiptImage);

    const response = await axiosInstance.post(`/products/fridge/${fridgeId}/receipt`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data.data;
};
