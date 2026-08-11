import { Category } from "@/components/domain/home/CategoryTabs";
import { Fridge } from "@/types/fridge";
import { create } from "zustand";
import { Product, ProductListItemType } from "@/types/product";

export type CategoryFilter = "전체" | "냉장" | "냉동" | "실온";

export type SortType = "EXPIRE" | "CATEGORY";

interface HomeState {
    keyword: string;
    setKeyword: (keyword: string) => void;

    category: Category;
    setCategory: (category: Category) => void;

    sortType: SortType;
    setSortType: (sortType: SortType) => void;

    fridges: Fridge[];
    setFridges: (fridges: Fridge[]) => void;

    selectedFridgeId: number | null;
    setSelectedFridgeId: (id: number | null) => void;

    products: ProductListItemType[];
    setProducts: (products: ProductListItemType[]) => void;

    isLoading: boolean;
}

export const useHomeStore = create<HomeState>(set => ({
    keyword: "",
    category: "전체",
    sortType: "EXPIRE",

    fridges: [],
    selectedFridgeId: null,

    products: [],
    isLoading: false,

    setCategory: category => set({ category }),
    setKeyword: keyword => set({ keyword }),
    setSortType: sortType => set({ sortType }),

    setFridges: fridges => set({ fridges }),
    setSelectedFridgeId: selectedFridgeId => set({ selectedFridgeId }),

    setProducts: products => set({ products }),
}));
