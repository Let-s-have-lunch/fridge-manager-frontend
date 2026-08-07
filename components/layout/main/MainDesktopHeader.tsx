import React, { useRef } from "react";
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
import { useFridgeHeader } from "@/hooks/useFridgeHeader";
import SortSheet from "@/components/home/header/SortSheet";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHomeStore } from "@/stores/home/productStore"; // 👈 스토어 임포트 확인!

export default function MainDesktopHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const isHome = pathname === "/";

    const { user, isLoggedIn } = useAuthStore();
    const userName = user?.nickname ?? "";
    const userId = user?.id;

    const fridge = useFridgeHeader();
    const sortSheetRef = useRef<BottomSheetModal>(null);

    const sortType = useHomeStore(state => state.sortType);
    const setSortType = useHomeStore(state => state.setSortType);

    return (
        <View className="bg-bg-subtle pt-5 pb-4 items-center w-full ">
            <View className="w-full max-w-6xl px-5 flex-row items-center justify-between z-50">
                {/* 1. [좌측] */}
                <View className="flex-row items-center flex-1">
                    <Pressable className="w-[50px] h-[50px] rounded-full overflow-hidden bg-bg-default shrink-0">
                        <Image
                            source={getAnimalIcon(isLoggedIn ? userId : undefined)}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    </Pressable>

                    <View className="ml-3 justify-center relative">
                        {!isLoggedIn ? (
                            <View className="flex-col justify-center">
                                <TextComponent className="text-[15px] font-bold text-text-default">
                                    안녕하세요!
                                </TextComponent>
                                <TextComponent className="text-[11px] text-text-secondary mt-0.5">
                                    로그인하고 냉장고를 관리해보세요.
                                </TextComponent>
                            </View>
                        ) : (
                            <View className="flex-row items-center gap-2">
                                <TextComponent
                                    className="text-[16px] font-bold text-text-default"
                                    numberOfLines={1}>
                                    {userName}님
                                </TextComponent>

                                {isHome && (
                                    <Pressable
                                        onPress={() => fridge.setIsFridgeOpen(prev => !prev)}
                                        className={twMerge(
                                            "px-2 py-0.5 flex-row items-center",
                                            "rounded-full border border-[#A18F8F]",
                                        )}>
                                        <TextComponent className="mr-1 ml-1 text-[12px] font-medium text-text-default">
                                            {fridge.selectedFridge?.name ?? "냉장고"}
                                        </TextComponent>
                                        <Ionicons
                                            name={
                                                fridge.isFridgeOpen ? "chevron-up" : "chevron-down"
                                            }
                                            size={12}
                                            color="#A18F8F"
                                        />
                                    </Pressable>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {/* 2. [중앙] */}
                <View className="flex-row items-center justify-center gap-14 mx-4">
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

                {/* 3. [우측] */}
                <View className="flex-row items-center justify-end gap-2 flex-1">
                    {isHome && (
                        <>
                            <Pressable
                                onPress={isLoggedIn ? fridge.handleSearchToggle : undefined}
                                className="w-10 h-10 rounded-full bg-bg-default items-center justify-center">
                                <Ionicons
                                    name={fridge.isSearchOpen ? "close" : "search"}
                                    size={20}
                                    color="#A18F8F"
                                />
                            </Pressable>

                            <Pressable
                                onPress={
                                    isLoggedIn ? () => sortSheetRef.current?.present() : undefined
                                }
                                className="w-10 h-10 rounded-full bg-bg-default items-center justify-center">
                                <Ionicons name="swap-vertical" size={22} color="#A18F8F" />
                            </Pressable>
                        </>
                    )}
                </View>
            </View>

            {/* 4. 이하 기능적인 모달, 드롭다운 등은 로그인 시에만 렌더링 */}
            {isLoggedIn && isHome && fridge.isSearchOpen && (
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

            {isLoggedIn && isHome && (
                <>
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

                    <SortSheet
                        ref={sortSheetRef}
                        selected={sortType}
                        onSelect={type => {
                            setSortType(type);
                            sortSheetRef.current?.dismiss();
                        }}
                    />
                    <FridgeHeaderModals {...fridge} />
                </>
            )}
        </View>
    );
}
