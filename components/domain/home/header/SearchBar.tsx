import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

import Input from "@/components/common/input/Input";

interface SearchBarProps {
    keyword: string;
    onChangeKeyword: (text: string) => void;
}

export default function SearchBar({ keyword, onChangeKeyword }: SearchBarProps) {

    return (
        <View
            className={twMerge(
                "mt-4",
                "h-[48px]",
                "flex-row",
                "items-center",
                "rounded-full",
                "border",
                "border-primary-main",
                "bg-bg-paper",
                "px-4",
            )}>
            <Input
                className={twMerge("mb-0", "flex-1", "px-0", "py-0", "text-sm")}
                placeholder=" 어떤 식재료를 찾으시나요?"
                placeholderTextColor="text-text-subtle"
                hideBorder
                value={keyword}
                onChangeText={onChangeKeyword}
                returnKeyType="search"
                autoFocus
                searchIcon={<Ionicons name="search" size={20} color="#A18F8F" />}
            />
        </View>
    );
}
