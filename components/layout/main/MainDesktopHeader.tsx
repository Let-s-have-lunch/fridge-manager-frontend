import { useState } from "react";
import { Pressable, View, Image } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, Href } from "expo-router";
import { getAnimalIcon } from "@/constants/profile";
import { useHomeStore } from "@/stores/home/productStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import TextComponent from "@/components/common/text/TextComponent";
import Input from "@/components/common/input/Input";
import { USER_NAV_LIST } from "@/constants/menu";

export default function MainDesktopHeader() {
    const router = useRouter();
    const pathname = usePathname();

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
            {/* 데스크탑 전체 프레임 폭에 맞춘 컨테이너 */}
            <View className="w-full max-w-6xl px-5 flex-row items-center justify-between">
                {/* 1. [좌측] 프로필 및 냉장고 선택 영역 */}
                <View className="flex-row items-center shrink-0">
                    <Pressable className="w-[50px] h-[50px] rounded-full overflow-hidden bg-bg-default shrink-0">
                        <Image
                            source={getAnimalIcon(userId)}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    </Pressable>

                    <View className="ml-3 justify-center">
                        <View className="flex-row items-center gap-2">
                            <TextComponent
                                className="text-[16px] font-bold text-text-default"
                                numberOfLines={1}>
                                {userName}님
                            </TextComponent>

                            <Pressable
                                onPress={() => setIsFridgeOpen(prev => !prev)}
                                className={twMerge(
                                    "px-2 py-0.5",
                                    "flex-row items-center",
                                    "rounded-full border border-[#A18F8F]",
                                )}>
                                <TextComponent className="mr-1 text-[11px] font-medium text-text-default">
                                    {selectedFridge}
                                </TextComponent>
                                <Ionicons
                                    name={isFridgeOpen ? "chevron-up" : "chevron-down"}
                                    size={12}
                                    color="#A18F8F"
                                />
                            </Pressable>
                        </View>

                        <TextComponent className="text-[11px] text-text-secondary mt-0.5">
                            오늘도 신선한 하루되세요!
                        </TextComponent>
                    </View>
                </View>

                {/* 2. [중앙] 하단에 있던 탭 메뉴들을 상단 헤더로 이동 (홈, 일정, 통계, 마이페이지) */}
                <View className="flex-row items-center gap-14 mx-4">
                    {USER_NAV_LIST.map(tab => {
                        const isActive =
                            tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);
                        const colorClass = isActive
                            ? "text-primary-main font-bold"
                            : "text-text-secondary font-medium";

                        return (
                            <Pressable
                                key={tab.path}
                                onPress={() => router.push(tab.path as Href)}
                                className="py-2 relative items-center">
                                <TextComponent className={twMerge("text-[15px]", colorClass)}>
                                    {tab.name}
                                </TextComponent>
                                {/* 활성화 상태일 때 보여줄 하단 포인트 바 */}
                                {isActive && (
                                    <View className="absolute bottom-0 w-full h-[2px] bg-primary-main rounded-full" />
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* 3. [우측] 검색 및 유틸 아이콘 버튼 영역 */}
                <View className="flex-row items-center gap-2 shrink-0">
                    <Pressable
                        onPress={handleSearchToggle}
                        className={twMerge(
                            "w-10 h-10 rounded-full",
                            "bg-bg-default",
                            "items-center justify-center",
                        )}>
                        <Ionicons
                            name={isSearchOpen ? "close" : "search"}
                            size={20}
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
                            size={20}
                            color="#A18F8F"
                        />
                    </Pressable>
                </View>
            </View>

            {/* 검색창이 열렸을 때 헤더 하단에 펼쳐지는 검색바 영역 */}
            {isSearchOpen && (
                <View className="w-full max-w-6xl px-5 mt-3">
                    <View
                        className={twMerge(
                            "px-4 h-[46px]",
                            "flex-row items-center",
                            "rounded-full",
                            "border border-primary-main",
                            "bg-bg-paper",
                        )}>
                        <Input
                            className="flex-1 px-0 py-0 mb-0 text-sm"
                            placeholder="어떤 식재료를 찾으시나요?"
                            placeholderTextColor="text-text-subtle"
                            hideBorder
                            value={keyword}
                            onChangeText={setKeyword}
                            returnKeyType="search"
                            autoFocus
                            searchIcon={<Ionicons name={"search"} size={18} color={"#A18F8F"} />}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}
