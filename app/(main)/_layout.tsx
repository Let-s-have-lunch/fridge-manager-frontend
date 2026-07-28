import { View } from "react-native";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainFooter from "@/components/layout/main/MainFooter";
import { twMerge } from "tailwind-merge";
import MainHeader from "@/components/layout/main/MainHeader";

export default function MainLayout() {
    const { showMainHeader, showMainFooter } = useLayoutStore();
    const userName = "철수";
    const handleSearch = (keyword: string) => {
        console.log("검색어 입력됨:", keyword);
    };
    const handleSort = (order: "asc" | "desc") => {
        console.log("정렬 순서 변경됨:", order);
    };

    return (
        <View className="flex-1 bg-bg-default">
            {showMainHeader && (
                <MainHeader userName={userName} onSearch={handleSearch} onSortToggle={handleSort} />
            )}

            <View
                className={twMerge([
                    "flex-1",
                    "w-full",
                    "max-w-6xl",
                    "p-5",
                    "self-center",
                    "bg-bg-default",
                ])}>
                <Slot />
            </View>

            {showMainFooter && <MainFooter />}
        </View>
    );
}
