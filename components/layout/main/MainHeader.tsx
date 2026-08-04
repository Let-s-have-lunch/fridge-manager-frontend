import React, { useRef } from "react";
import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import HeaderProfile from "@/components/home/header/HeaderProfile";
import FridgeDropdown from "@/components/home/header/FridgeDropdown";
import SearchBar from "@/components/home/header/SearchBar";
import FridgeHeaderModals from "@/components/home/header/FridgeHeaderModals";
import { useFridgeHeader } from "@/hooks/useFridgeHeader"; // 👈 공통 훅
import SortSheet from "@/components/home/header/SortSheet"; // 👈 팀원이 추가한 정렬 모달
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useHomeStore } from "@/stores/home/productStore";

export default function MainHeader() {
    const user = useAuthStore(state => state.user);
    const userName = user?.nickname ?? "";
    const userId = user?.id;

    // 👈 붕어빵 틀(Hook)에서 필요한 기능만 쏙 빼옵니다!
    const fridge = useFridgeHeader();

    // 👇 팀원이 추가한 정렬 관련 상태 및 Ref
    const sortSheetRef = useRef<BottomSheetModal>(null);
    const sortType = useHomeStore(state => state.sortType);
    const setSortType = useHomeStore(state => state.setSortType);

    return (
        <View className="bg-bg-subtle px-6 pt-5 pb-4">
            <View className="flex-row justify-between">
                <HeaderProfile
                    userId={userId}
                    userName={userName}
                    fridgeName={fridge.selectedFridge?.name ?? "냉장고"}
                    isFridgeOpen={fridge.isFridgeOpen}
                    onPress={() => fridge.setIsFridgeOpen(prev => !prev)}
                />
                <View className="flex-row items-start">
                    {/* 검색 버튼 */}
                    <Pressable
                        onPress={fridge.handleSearchToggle}
                        className={twMerge(
                            "w-10 h-10 rounded-full bg-bg-default items-center justify-center mr-3",
                        )}>
                        <Ionicons
                            name={fridge.isSearchOpen ? "close" : "search"}
                            size={21}
                            color="#A18F8F"
                        />
                    </Pressable>

                    {/* 🛠️ [수정됨] 정렬 버튼: 중복된 Pressable을 하나로 합쳤습니다 */}
                    <Pressable
                        onPress={() => sortSheetRef.current?.present()}
                        className={twMerge(
                            "w-10",
                            "h-10",
                            "rounded-full",
                            "bg-bg-default",
                            "items-center",
                            "justify-center",
                        )}>
                        <Ionicons name="swap-vertical" size={22} color="#A18F8F" />
                    </Pressable>
                </View>
            </View>

            {fridge.isSearchOpen && (
                <SearchBar keyword={fridge.keyword} onChangeKeyword={fridge.setKeyword} />
            )}

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

            {/* 👇 팀원이 추가한 정렬 모달 렌더링 */}
            <SortSheet
                ref={sortSheetRef}
                selected={sortType}
                onSelect={type => {
                    setSortType(type);
                    sortSheetRef.current?.dismiss();
                }}
            />

            {/* 👈 모달들을 한 줄로 깔끔하게 정리 (DeleteFridgeSheet도 이 안에 잘 들어있습니다!) */}
            <FridgeHeaderModals {...fridge} />
        </View>
    );
}
