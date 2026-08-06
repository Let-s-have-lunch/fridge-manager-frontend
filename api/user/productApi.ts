import axiosInstance from "@/api/axiosInstance";
import { Product, ProductDetailItemType, ProductListItemType } from "@/types/product";
import { ProductInputType } from "@/schemas/user/productSchema";

const getProductList = async (fridgeId: number): Promise<ProductListItemType[]> => {
    const response = await axiosInstance.get(`/products/fridge/${fridgeId}`);
    return response.data.data;
};

const getProductById = async (productId: number): Promise<ProductDetailItemType> => {
    const response = await axiosInstance.get(`/products/${productId}`);
    return response.data.data;
};

const createProduct = async (fridgeId: number, input: ProductInputType): Promise<Product> => {
    const response = await axiosInstance.post(`/products/fridge/${fridgeId}`, input);
    return response.data.data;
};

const updateProduct = async (
    productId: number,
    input: ProductInputType,
): Promise<Product> => {
    const response = await axiosInstance.patch(`/products/${productId}`, input);
    return response.data.data;
};

const deleteProduct = async (productId: number): Promise<void> => {
    await axiosInstance.delete(`/products/${productId}`);
};


export default {
    getProductList,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
