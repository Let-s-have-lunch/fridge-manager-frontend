import { useRef, useState } from "react";
import { Pressable, View, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useHomeStore } from "@/stores/home/productStore";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import FridgeSettingSheet from "@/components/home/header/FridgeSettingSheet";
import HeaderProfile from "@/components/home/header/HeaderProfile";
import FridgeDropdown from "@/components/home/header/FridgeDropdown";
import SearchBar from "@/components/home/header/SearchBar";
import AddFridgeSheet from "@/components/home/header/AddFridgeSheet";

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
    const handleSearchToggle = () => {
        setIsSearchOpen(prev => !prev);

        if (isSearchOpen) {
            setKeyword("");
        }
    };
    const handleOpenSetting = () => {
        setIsFridgeOpen(false);

        setTimeout(() => {
            bottomSheetRef.current?.present();
        }, 200);
    };
    const handleOpenAddFridge = () => {
        bottomSheetRef.current?.dismiss();
        setTimeout(() => {
            addFridgeRef.current?.present();
        }, 200);
    };


    const addFridgeRef = useRef<BottomSheetModal>(null);

    // 현재 선택된 냉장고
    const selectedFridge = fridges.find(fridge => fridge.id === selectedFridgeId);

    return (
        <View className="bg-bg-subtle px-6 pt-5 pb-4">
            <View className="flex-row justify-between">
                <HeaderProfile
                    userId={userId}
                    userName={userName}
                    fridgeName={selectedFridge?.name ?? "냉장고"}
                    isFridgeOpen={isFridgeOpen}
                    onPress={() => setIsFridgeOpen(prev => !prev)}
                />
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
            {isSearchOpen && <SearchBar keyword={keyword} onChangeKeyword={setKeyword} />}
            <FridgeDropdown
                visible={isFridgeOpen}
                fridges={fridges}
                selectedFridgeId={selectedFridgeId}
                onClose={() => setIsFridgeOpen(false)}
                onSelect={id => {
                    setSelectedFridgeId(id);
                    setIsFridgeOpen(false);
                }}
                onOpenSetting={handleOpenSetting}
            />
            <FridgeSettingSheet
                ref={bottomSheetRef}
                onClose={() => bottomSheetRef.current?.dismiss()}
                onAddFridge={handleOpenAddFridge}
            />
            <AddFridgeSheet ref={addFridgeRef} onClose={() => addFridgeRef.current?.dismiss()} />
        </View>
    );
}
