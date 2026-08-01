import { useMemo, useRef, useState } from "react";
import { Pressable, View, Image, Text, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import Input from "@/components/common/input/Input";
import { getAnimalIcon } from "@/constants/profile";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useHomeStore } from "@/stores/home/productStore";
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import MenuItem from "@/components/home/header/MenuItem";
import FridgeSettingSheet from "@/components/home/header/FridgeSettingSheet";

export default function MainHeader() {
    const user = useAuthStore(state => state.user);
    const userName = user?.nickname ?? "";
    const userId = user?.id;

    const fridges = useHomeStore(state => state.fridges);
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);
    const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);

    const keyword = useHomeStore(state => state.keyword);
    const setKeyword = useHomeStore(state => state.setKeyword);

    const category = useHomeStore(state => state.category);

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isFridgeOpen, setIsFridgeOpen] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["70%"], []);
    const handleSearchToggle = () => {
        setIsSearchOpen(prev => !prev);

        if (isSearchOpen) {
            setKeyword("");
        }
    };

    // 현재 선택된 냉장고
    const selectedFridge = fridges.find(fridge => fridge.id === selectedFridgeId);

    return (
        <View className="bg-bg-subtle px-6 pt-5 pb-4">
            <View className="flex-row justify-between">
                <View className="flex-row flex-1">
                    <Pressable className="w-[60px] h-[60px] rounded-full overflow-hidden bg-bg-default">
                        <Image
                            source={getAnimalIcon(userId)}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    </Pressable>

                    <View className="ml-4 justify-center">
                        <View className="gap-1">
                            <Text className="text-[22px] font-bold text-text-default">
                                {userName}님
                            </Text>

                            <View className="relative z-50 self-start">
                                <Pressable
                                    onPress={() => setIsFridgeOpen(prev => !prev)}
                                    className={twMerge(
                                        "mt-1",
                                        "px-3",
                                        "py-1",
                                        "flex-row",
                                        "items-center",
                                        "rounded-full",
                                        "border",
                                        "border-[#A18F8F]",
                                    )}>
                                    <Text className="mr-1 text-xs font-medium text-text-default">
                                        {selectedFridge?.name ?? "냉장고"}
                                    </Text>

                                    <Ionicons
                                        name={isFridgeOpen ? "chevron-up" : "chevron-down"}
                                        size={14}
                                        color="#A18F8F"
                                    />
                                </Pressable>
                            </View>
                        </View>

                        {/*<Text className="mt-1 text-[13px] text-text-secondary">*/}
                        {/*    오늘도 신선한 하루되세요!*/}
                        {/*</Text>*/}
                    </View>
                </View>

                <View className="flex-row items-start">
                    <Pressable
                        onPress={handleSearchToggle}
                        className={twMerge(
                            "w-10",
                            "h-10",
                            "rounded-full",
                            "bg-bg-default",
                            "items-center",
                            "justify-center",
                            "mr-3",
                        )}>
                        <Ionicons
                            name={isSearchOpen ? "close" : "search"}
                            size={21}
                            color="#A18F8F"
                        />
                    </Pressable>

                    <Pressable
                        onPress={() => {}}
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
            {isSearchOpen && (
                <View
                    className={twMerge(
                        "mt-4",
                        "px-4",
                        "h-[48px]",
                        "flex-row",
                        "items-center",
                        "rounded-full",
                        "border",
                        "border-primary-main",
                        "bg-bg-paper",
                    )}>
                    <Input
                        className={twMerge("flex-1", "px-0", "py-0", "mb-0", "text-sm")}
                        placeholder=" 어떤 식재료를 찾으시나요?"
                        placeholderTextColor="text-text-subtle"
                        hideBorder
                        value={keyword}
                        onChangeText={setKeyword}
                        returnKeyType="search"
                        autoFocus
                        searchIcon={<Ionicons name="search" size={20} color="#A18F8F" />}
                    />
                </View>
            )}
            <Modal
                visible={isFridgeOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsFridgeOpen(false)}>
                <Pressable className="flex-1 bg-black/20" onPress={() => setIsFridgeOpen(false)}>
                    <View
                        className={twMerge(
                            "absolute",
                            "top-24",
                            "left-24",
                            "w-56",
                            "rounded-2xl",
                            "bg-bg-paper",
                            "border",
                            "border-[#BACFCD]",
                            "overflow-hidden",
                        )}>
                        {fridges.map(fridge => (
                            <Pressable
                                key={fridge.id}
                                onPress={() => {
                                    setSelectedFridgeId(fridge.id);
                                    setIsFridgeOpen(false);
                                }}
                                className={twMerge(
                                    "px-4",
                                    "py-3",
                                    fridge.id === selectedFridgeId && "bg-primary-subtle",
                                )}>
                                <Text className="text-text-default">
                                    {fridge.id === selectedFridgeId ? "✓ " : ""}
                                    {fridge.name}
                                </Text>
                            </Pressable>
                        ))}

                        <View className="border-t border-gray-200" />

                        <Pressable
                            className="px-4 py-3"
                            onPress={() => {
                                setIsFridgeOpen(false);

                                setTimeout(() => {
                                    bottomSheetRef.current?.present();
                                }, 200);
                            }}>
                            <Text className="font-medium text-text-default">⚙️ 냉장고 설정</Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>
            <FridgeSettingSheet
                ref={bottomSheetRef}
                onClose={() => bottomSheetRef.current?.dismiss()}
            />
        </View>
    );
}
