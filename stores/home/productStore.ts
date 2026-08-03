import { Category } from "@/components/home/CategoryTabs";
import { Fridge } from "@/types/fridge";
import { create } from "zustand";
import { Product } from "@/types/product";

type SortType = "category" | "expiration";

interface HomeState {
    keyword: string;
    category: Category;
    sortType: SortType;

    fridges: Fridge[];
    selectedFridgeId: number | null;

    products: Product[];
    isLoading: boolean;

    setKeyword: (keyword: string) => void;
    setCategory: (category: Category) => void;
    setSortType: (sortType: SortType) => void;

    setFridges: (fridges: Fridge[]) => void;
    setSelectedFridgeId: (id: number | null) => void;

    setProducts: (products: Product[]) => void;
}

export const useHomeStore = create<HomeState>(set => ({
    keyword: "",
    category: "전체",
    sortType: "expiration",

    fridges: [],
    selectedFridgeId: null,

    products: [],
    isLoading: false,

    setKeyword: keyword => set({ keyword }),
    setCategory: category => set({ category }),
    setSortType: sortType => set({ sortType }),

    setFridges: fridges => set({ fridges }),
    setSelectedFridgeId: selectedFridgeId => set({ selectedFridgeId }),

    setProducts: products => set({ products }),
}));

