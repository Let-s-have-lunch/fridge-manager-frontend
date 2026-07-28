import { useState } from "react";
import { Pressable, View, Image, Text, TextInput } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/common/input/Input";
import { useSetupLayout } from "@/hooks/useSetupLayout";

const PROFILE_IMAGES = [
    "https://via.placeholder.com/150/FFB3B3/000000?text=Profile1",
    "https://via.placeholder.com/150/FFD1B3/000000?text=Profile2",
    "https://via.placeholder.com/150/FFFFB3/000000?text=Profile3",
    "https://via.placeholder.com/150/B3FFB3/000000?text=Profile4",
    "https://via.placeholder.com/150/B3B3FF/000000?text=Profile5",
];

interface MainHeaderProps {
    userName: string;
    onSearch: (Keyword: string) => void;
    onSortToggle: (order: "asc" | "desc") => void;
}

export default function MainHeader({ userName, onSearch, onSortToggle }: MainHeaderProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);

    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        // 검색창을 닫을 때 검색어 초기화 로직이 필요하다면 여기에 추가
        if (isSearchOpen) {
            setSearchKeyword("");
            onSearch("");
        }
    };

    const handleSortToggle = () => {
        const nextOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(nextOrder);
        onSortToggle(nextOrder);
    };

    const handleSearchExecute = () => {
        if (searchKeyword.trim() !== "") {
            onSearch(searchKeyword);
        }
    };

    useSetupLayout({ showMainHeader: true });

    return (
        <View className={twMerge("px-5 py- bg-bg-subtle")}>
            <View className={twMerge(["flex-row", "justify-between", "items-center"])}>
                <View className={twMerge(["flex-row", "items-center", "flex-1"])}>
                    <Pressable
                        onPress={() => {
                            setSelectedProfileIndex(prev => (prev + 1) % PROFILE_IMAGES.length);
                        }}
                        className={twMerge(
                            ["w-[58px]", "h-[58px]"],
                            ["rounded-full", "overflow-hidden"],
                            ["bg-bg-default"],
                        )}>
                        <Image
                            source={{ uri: PROFILE_IMAGES[selectedProfileIndex] }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </Pressable>
                    <View>
                        <Text className="text-xl font-bold text-text-default">{userName}님</Text>
                        <Text className="text-[13px] text-text-secondary mt-[6px]">
                            오늘도 신선한 하루되세요!
                        </Text>
                    </View>
                </View>
                <View className={"flex-row items-center space-x-2.5"}>
                    <Pressable
                        onPress={handleSearchToggle}
                        className={twMerge(
                            ["w-5", "h-5", "rounded-full"],
                            ["bg-bg-paper"],
                            ["items-center", "justify-center"],
                            ["ml-[10px]"],
                            // isSearchOpen && "bg-orange-100", // 열려있을 때 색상 반전
                        )}>
                        <Ionicons
                            name={isSearchOpen ? "close" : "search"}
                            size={20}
                            color={"#A18F8F"}
                        />
                    </Pressable>
                    <Pressable>
                        <Ionicons
                            name={sortOrder === "asc" ? "arrow-down" : "arrow-up"}
                            size={20}
                            color={"#A19F8F"}
                        />
                    </Pressable>
                </View>
            </View>

            {isSearchOpen && (
                <View
                    className={twMerge(
                        ["mt-4", "flex-row", "items-center"],
                        ["bg-bg-paper"],
                        ["rounded-[25px]"],
                        ["px-4 py-2"],
                        ["shadow-sm"],
                        ["border border-primary-main"],
                    )}>
                    <Pressable onPress={handleSearchExecute}>
                        <Ionicons name="search" size={20} color="#A18F8F" className={"mr-7"} />
                    </Pressable>
                    <Input
                        className={twMerge(["flex-1"], ["px-5 py-4"], ["text-xs"], ["mb-4"])}
                        placeholder={"어떤 식재료를 찾으시나요?"}
                        placeholderTextColor={"text-text-subtle"}
                        value={searchKeyword}
                        onChangeText={text => setSearchKeyword(text)}
                        onSubmitEditing={handleSearchExecute}
                        returnKeyType="search"
                        autoFocus={true}
                    />
                </View>
            )}
        </View>
    );
}
