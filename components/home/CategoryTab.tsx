import { useState } from "react";
import { Pressable, View, Text } from "react-native";
import { twMerge } from "tailwind-merge";

const CATEGORIES = ["전체", "냉장", "냉동", "실온"];

export default function CategoryTab() {
    const [activeTab, setActiveTab] = useState("전체");

    return (
        <View
            className={twMerge(
                ["flex-row", "justify-around"],
                ["bg-bg-paper", "rounded-[25px]", "shadow-sm"],
            )}>
            {CATEGORIES.map(tab => (
                <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={twMerge(
                        "px-[15px] py-[10px] rounded-[28px]",
                        activeTab === tab ? "bg-bg-subtle" : "bg-bg-paper",
                    )}>
                    <Text
                        className={twMerge(
                            "text-[15px] font-semibold",
                            activeTab === tab ? "text-primary-main" : "text-text-secondary",
                        )}>
                        {tab}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}
