import React from "react";
import { Pressable, View, Image } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname, Href } from "expo-router";
import { getAnimalIcon } from "@/constants/profile";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import TextComponent from "@/components/common/text/TextComponent";
import Input from "@/components/common/input/Input";
import { USER_NAV_LIST } from "@/constants/menu";
import FridgeDropdown from "@/components/home/header/FridgeDropdown";
import FridgeHeaderModals from "@/components/home/header/FridgeHeaderModals";
import { useFridgeHeader } from "@/hooks/useFridgeHeader"; // 👈 새로 만든 훅 임포트

export default function MainDesktopHeader() {
    const router = useRouter();
    const pathname = usePathname();

    const user = useAuthStore(state => state.user);
    const userName = user?.nickname ?? "";
    const userId = user?.id;

    // 👈 붕어빵 틀(Hook)에서 똑같이 기능 쏙 빼오기
    const fridge = useFridgeHeader();

    return (
        <View className="bg-bg-subtle pt-5 pb-4 items-center w-full ">
            <View className="w-full max-w-6xl px-5 flex-row items-center justify-between z-50">
                {/* 1. [좌측] 프로필 및 냉장고 선택 영역 */}
                <View className="flex-row items-center shrink-0">
                    <Pressable className="w-[50px] h-[50px] rounded-full overflow-hidden bg-bg-default shrink-0">
                        <Image
                            source={getAnimalIcon(userId)}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    </Pressable>

                    <View className="ml-3 justify-center relative">
                        <View className="flex-row items-center gap-2">
                            <TextComponent
                                className="text-[16px] font-bold text-text-default"
                                numberOfLines={1}>
                                {userName}님
                            </TextComponent>

                            <Pressable
                                onPress={() => fridge.setIsFridgeOpen(prev => !prev)}
                                className={twMerge(
                                    "px-2 py-0.5 flex-row items-center",
                                    "rounded-full border border-[#A18F8F]",
                                )}>
                                {/* 👈 하드코딩된 이름 대신 상태에서 가져오기 */}
                                <TextComponent className="mr-1 ml-1 text-[12px] font-medium text-text-default">
                                    {fridge.selectedFridge?.name ?? "냉장고"}
                                </TextComponent>
                                <Ionicons
                                    name={fridge.isFridgeOpen ? "chevron-up" : "chevron-down"}
                                    size={12}
                                    color="#A18F8F"
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* 2. [중앙] 메뉴 */}
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
                                {isActive && (
                                    <View className="absolute bottom-0 w-full h-[2px] bg-primary-main rounded-full" />
                                )}
                            </Pressable>
                        );
                    })}
                </View>

                {/* 3. [우측] 유틸 아이콘 */}
                <View className="flex-row items-center gap-2 shrink-0">
                    <Pressable
                        onPress={fridge.handleSearchToggle}
                        className="w-10 h-10 rounded-full bg-bg-default items-center justify-center">
                        <Ionicons
                            name={fridge.isSearchOpen ? "close" : "search"}
                            size={20}
                            color="#A18F8F"
                        />
                    </Pressable>

                    <Pressable className="w-10 h-10 rounded-full bg-bg-default items-center justify-center">
                        <Ionicons name="swap-vertical" size={22} color="#A18F8F" />
                    </Pressable>
                </View>
            </View>

            {/* 4. 검색창 */}
            {fridge.isSearchOpen && (
                <View className="w-full max-w-6xl px-5 mt-3">
                    <View
                        className={twMerge(
                            "px-4 h-[46px] flex-row items-center rounded-full border border-primary-main bg-bg-paper",
                        )}>
                        <Input
                            className="flex-1 px-0 py-0 mb-0 text-sm"
                            placeholder="어떤 식재료를 찾으시나요?"
                            placeholderTextColor="text-text-subtle"
                            hideBorder
                            value={fridge.keyword}
                            onChangeText={fridge.setKeyword}
                            returnKeyType="search"
                            autoFocus
                            searchIcon={<Ionicons name={"search"} size={18} color={"#A18F8F"} />}
                        />
                    </View>
                </View>
            )}

            {/* 5. 데스크탑용 냉장고 드롭다운 및 모달 연동 */}
            <View className="absolute top-[70px] left-0 w-full z-40 pointer-events-none">
                <View className="w-full max-w-6xl px-5 mx-auto pointer-events-auto">
                    <FridgeDropdown
                        visible={fridge.isFridgeOpen}
                        fridges={fridge.fridges}
                        selectedFridgeId={fridge.selectedFridgeId}
                        onClose={() => fridge.setIsFridgeOpen(false)}
                        onSelect={id => {
                            fridge.setSelectedFridgeId(id);
                            fridge.setIsFridgeOpen(false);
                        }}
                        onOpenSetting={fridge.handleOpenSetting}
                    />
                </View>
            </View>

            {/* 6. 모달 렌더링 */}
            <FridgeHeaderModals {...fridge} />
        </View>
    );
}
