import { useState } from "react";
import { Pressable, View, Image, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/common/input/Input";
import { useSetupLayout } from "@/hooks/useSetupLayout";
import { getAnimalIcon } from "@/components/utils/profile";
import { useHomeStore } from "@/stores/home/productStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";


export default function MainHeader() {
    useSetupLayout({ showMainHeader: true });

    const user = useAuthStore(state => state.user);
    const userName = user?.nickname ?? "";
    const userId = user?.id;

    const keyword = useHomeStore(state => state.keyword);
    const setKeyword = useHomeStore(state => state.setKeyword);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const handleSearchToggle = () => {
        setIsSearchOpen(prev => !prev);

        if (isSearchOpen) {
            setKeyword("");
        }
    };

    const category = useHomeStore(state => state.category);

    const sortOrder = useHomeStore(state => state.sortOrder);
    const setSortOrder = useHomeStore(state => state.setSortOrder);

    const handleSortToggle = () => {
        const nextOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(nextOrder);
    };

    const [ selectedFridge, setSelectedFridge ] = useState("집 냉장고");
    const [ isFridgeOpen, setIsFridgeOpen ] = useState(false);



    return (
        <View className="bg-bg-subtle px-6 pt-5 pb-4">
            <View className="flex-row justify-between">
                <View className="flex-row flex-1">
                    <Pressable
                        className="w-[60px] h-[60px] rounded-full overflow-hidden bg-bg-default">
                        <Image
                            source={getAnimalIcon(userId)}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </Pressable>

                    <View className="ml-4 justify-center">
                        <Text className="text-[22px] font-bold text-text-default">
                            {userName}님
                        </Text>
                        <Pressable onPress={() => setIsFridgeOpen((prev => !prev))} className={"flex-row items-center ml-2"}>
                            <Text className={"text-sm text-text-secondary"}>
                                {selectedFridge}
                            </Text>
                            <Ionicons name={isFridgeOpen ? "chevron-up" : "chevron-down"} size={16} color={"text-text-secondary"}/>

                        </Pressable>
                        <Text className="mt-1 text-[13px] text-text-secondary">
                            오늘도 신선한 하루되세요!
                        </Text>
                    </View>
                </View>

                <View className="flex-row items-start">
                    <Pressable
                        onPress={handleSearchToggle}
                        className={twMerge(
                            "w-10 h-10 rounded-full",
                            "bg-bg-default",
                            "items-center justify-center",
                            "mr-3",
                        )}>
                        <Ionicons
                            name={isSearchOpen ? "close" : "search"}
                            size={21}
                            color="#A18F8F"
                        />
                    </Pressable>

                    <Pressable
                        onPress={handleSortToggle}
                        className={twMerge(
                            "w-10 h-10 rounded-full",
                            "bg-bg-default",
                            "items-center justify-center",
                        )}>
                        <Ionicons
                            name={sortOrder === "asc" ? "arrow-down" : "arrow-up"}
                            size={21}
                            color="#A18F8F"
                        />
                    </Pressable>
                </View>
            </View>

            {isSearchOpen && (
                <View
                    className={twMerge(
                        ["mt-4", "px-4", "h-[48px]"],
                        ["flex-row", "items-center"],
                        ["rounded-full"],
                        ["border", "border-primary-main"],
                        ["bg-bg-paper"],
                    )}>
                    <Input
                        className={twMerge(["flex-1"], ["px-0", "py-0", "mb-0"], ["text-sm"])}
                        placeholder=" 어떤 식재료를 찾으시나요?"
                        placeholderTextColor="text-text-subtle"
                        hideBorder
                        value={keyword}
                        onChangeText={setKeyword}
                        returnKeyType="search"
                        autoFocus
                        searchIcon={<Ionicons name={"search"} size={20} color={"#A18F8F"} />}
                        />
                </View>
            )}
        </View>
    );
}

// "border border-primary-main",