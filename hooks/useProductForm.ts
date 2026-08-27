import { useState, useEffect, useCallback } from "react";
import { Keyboard, LayoutRectangle, Alert } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import { productSchema, ProductInputType } from "@/schemas/product/productSchema";
import { Category } from "@/types/category";
import { ProductDetailItemType } from "@/types/product";
import productApi from "@/api/user/productApi";
import categoryApi from "@/api/user/categoryApi";
import { useHomeStore } from "@/stores/home/productStore";

export function useProductForm(
    visible: boolean,
    initialData: ProductDetailItemType | null,
    onClose: () => void,
    onRefresh: () => Promise<void>,
) {
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);

    // 1. 화면 및 카테고리 상태 관리
    const [screen, setScreen] = useState<"form" | "selectCategory" | "createCategory">("form");
    const [categoryMode, setCategoryMode] = useState<"create" | "edit">("create");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    // 2. 드롭다운 상태 관리
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(null);

    // 3. React Hook Form 초기화
    const formMethods = useForm<ProductInputType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            memo: "",
            categoryId: 1,
            storageType: "REFRIGERATED",
            quantity: 1,
            unit: "EA",
            price: 0,
            expirationDate: "",
            status: "STORED",
        },
        mode: "onTouched",
    });

    const isEditMode = !!initialData;

    // 4. 데이터 로드 및 초기화 로직
    const loadCategories = async () => {
        try {
            const result = await categoryApi.getCategoryList();
            setCategories(result);
        } catch (error) {
            console.error("카테고리 로드 실패:", error);
        }
    };

    useEffect(() => {
        if (visible) {
            loadCategories();
            if (initialData) {
                const formattedDate = initialData.expirationDate
                    ? initialData.expirationDate.substring(0, 10).replace(/-/g, "")
                    : "";

                // 💡 category.id 또는 categoryId 둘 다 대응 가능하도록 추출
                const targetCategoryId =
                    initialData.category?.id ?? (initialData as any).categoryId ?? 1;

                formMethods.reset({
                    ...initialData,
                    categoryId: targetCategoryId, // 👈 폼 값에 categoryId 명시적 주입
                    memo: initialData.memo || "",
                    price: initialData.price ?? ("" as any),
                    expirationDate: formattedDate,
                });
            } else {
                formMethods.reset({
                    name: "",
                    memo: "",
                    categoryId: 1,
                    storageType: "REFRIGERATED",
                    quantity: 1,
                    unit: "EA",
                    price: 0,
                    expirationDate: "",
                    status: "STORED",
                });
            }
        } else {
            setActiveDropdown(null);
            setDropdownLayout(null);
            setScreen("form");
            setCategoryMode("create");
            setEditingCategory(null);
        }
    }, [visible, initialData, formMethods.reset]);

    // 5. 드롭다운 핸들러
    const handleDropdownChange = useCallback(
        (id: string, isOpen: boolean, layout?: LayoutRectangle) => {
            if (isOpen) {
                Keyboard.dismiss();
                setActiveDropdown(id);
                setDropdownLayout(layout || null);
            } else if (activeDropdown === id) {
                setActiveDropdown(null);
                setDropdownLayout(null);
            }
        },
        [activeDropdown],
    );

    const closeDropdown = () => {
        setActiveDropdown(null);
        setDropdownLayout(null);
    };

    // 6. 폼 제출 로직
    const onSubmit = async (data: ProductInputType) => {
        try {
            const { expirationDate, price, ...prevInput } = data;
            let formattedExpirationDate = expirationDate;

            if (expirationDate && expirationDate.length === 8) {
                formattedExpirationDate = `${expirationDate.slice(0, 4)}-${expirationDate.slice(4, 6)}-${expirationDate.slice(6, 8)}T00:00:00Z`;
            }

            const payload = {
                ...prevInput,
                expirationDate: formattedExpirationDate,
                price: price === null ? undefined : price,
            };

            if (isEditMode && initialData) {
                await productApi.updateProduct(initialData.id, payload as any);
            } else {
                if (!selectedFridgeId) return Alert.alert("오류", "선택된 냉장고가 없습니다.");
                await productApi.createProduct(selectedFridgeId, payload as any);
            }

            await onRefresh();
            onClose();
        } catch (error) {
            const errorMessage =
                isAxiosError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "알 수 없는 오류가 발생했습니다.";
            formMethods.setError("root", { message: errorMessage });
        }
    };

    return {
        screen,
        setScreen,
        categoryMode,
        setCategoryMode,
        editingCategory,
        setEditingCategory,
        categories,
        loadCategories,
        activeDropdown,
        dropdownLayout,
        handleDropdownChange,
        closeDropdown,
        formMethods,
        isEditMode,
        onSubmit,
        displayCreatedAt: initialData?.createdAt
            ? initialData.createdAt.substring(0, 10)
            : new Date().toISOString().substring(0, 10),
    };
}
