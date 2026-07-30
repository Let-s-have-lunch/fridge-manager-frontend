import { Pressable, View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import { useHomeStore } from "@/stores/home/productStore";

const categories = ["전체", "냉장", "냉동", "실온"] as const;

export type Category = (typeof categories)[number];

interface CategoryTabsProps {
    value: Category;
    onChange: (category: Category) => void;
}

export default function CategoryTabs({ value, onChange }: CategoryTabsProps) {

    const category = useHomeStore(state => state.category);
    const setCategory = useHomeStore(state => state.setCategory);

    return (
        <View
            className={twMerge(
                ["mt-[14px]", "flex-row"],
                ["rounded-[25px]"],
                ["bg-bg-paper", "shadow-sm"],
            )}>
            {categories.map(category => {
                const selected = value === category;

                return (
                    <Pressable
                        key={category}
                        onPress={() => onChange(category)}
                        className={twMerge(
                            ["flex-1 py-2"], ["items-center justify-center rounded-full"],
                            selected && "bg-bg-subtle",
                        )}>
                        <TextComponent
                            className={twMerge(
                                "text-[15px]",
                                selected ? "text-primary-main font-semibold" : "text-text-secondary",
                            )}>
                            {category}
                        </TextComponent>
                    </Pressable>
                );
            })}
        </View>
    );
}
