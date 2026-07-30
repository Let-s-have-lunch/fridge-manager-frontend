import { Category } from "@/components/home/CategoryTabs";
import { create } from "zustand";

interface HomeState {
    keyword: string;
    category: Category;
    sortOrder: "asc" | "desc";

    setKeyword: (keyword: string) => void;
    setCategory: (category: Category) => void;
    setSortOrder: (order: "asc" | "desc") => void;

}

export const useHomeStore = create<HomeState>(set => ({
    keyword: "",
    category: "전체",
    sortOrder: "asc",

    setKeyword: keyword => set({ keyword }),
    setCategory: category => set({ category }),
    setSortOrder: sortOrder => set({ sortOrder }),
}));

