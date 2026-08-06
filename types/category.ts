import { CategoryIconKey } from "@/constants/categoryIcons";

export interface Category {
    id: number;
    name: string;
    icon: CategoryIconKey;
    isDefault: boolean;
}
