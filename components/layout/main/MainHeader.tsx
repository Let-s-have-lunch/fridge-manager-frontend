import { useState } from "react";
import { Pressable, View, Image, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/common/input/Input";
import { getAnimalIcon } from "@/constants/profile";
import { useHomeStore } from "@/stores/home/productStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function MainHeader() {
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

    const [selectedFridge, setSelectedFridge] = useState("집 냉장고");
    const [isFridgeOpen, setIsFridgeOpen] = useState(false);

    return (
        <View className="bg-bg-subtle pt-5 pb-4 items-center w-full">
            <View className="w-full max-w-6xl px-5">
                {/* 상단 프로필 및 버튼 영역 */}
                <View className="flex-row justify-between w-full">
                    <View className="flex-row flex-1 mr-2">
                        <Pressable className="w-[50px] h-[50px] rounded-full overflow-hidden bg-bg-default shrink-0">
                            <Image
                                source={getAnimalIcon(userId)}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                        </Pressable>

                        {/* ✅ 핵심: flex-1을 주어 텍스트 영역이 우측 영역을 침범하지 않도록 경계선 설정 */}
                        <View className="ml-3 justify-center flex-1">
                            <View className={"flex-row items-center gap-2"}>
                                {/* ✅ 텍스트가 길거나 화면이 좁을 때 말줄임표(...) 처리 및 flex-shrink 적용 */}
                                <Text
                                    className="text-[18px] font-bold text-text-default flex-shrink"
                                    numberOfLines={1}
                                    ellipsizeMode="tail">
                                    {userName}님
                                </Text>

                                <Pressable
                                    onPress={() => setIsFridgeOpen(prev => !prev)}
                                    className={twMerge(
                                        ["px-2 py-1"],
                                        ["self-start flex-row items-center shrink-0"],
                                        ["rounded-full border border-[#A18F8F]"],
                                    )}>
                                    <Text className="mr-1 text-[11px] font-medium text-text-default">
                                        {selectedFridge}
                                    </Text>

                                    <Ionicons
                                        name={isFridgeOpen ? "chevron-up" : "chevron-down"}
                                        size={12}
                                        color="#A18F8F"
                                    />
                                </Pressable>
                            </View>

                            {/* ✅ 안내 문구도 화면이 너무 좁을 경우 줄바꿈되지 않도록 방어 */}
                            <Text
                                className="mt-1 text-[12px] text-text-secondary"
                                numberOfLines={1}>
                                오늘도 신선한 하루되세요!
                            </Text>
                        </View>
                    </View>

                    {/* 우측 아이콘 영역 (기존과 동일) */}
                    <View className="flex-row items-start shrink-0">
                        <Pressable
                            onPress={handleSearchToggle}
                            className={twMerge(
                                "w-10 h-10 rounded-full",
                                "bg-bg-default",
                                "items-center justify-center",
                                "mr-2",
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
        </View>
    );
}
