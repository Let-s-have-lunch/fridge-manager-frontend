import { View } from "react-native";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainFooter from "@/components/layout/main/MainFooter";
import { twMerge } from "tailwind-merge";
import MainHeader from "@/components/layout/main/MainHeader";
import MainDesktopHeader from "@/components/layout/main/MainDesktopHeader";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function MainLayout() {
    const { showMainHeader, showDesktopHeader, showMainFooter } = useLayoutStore();
    const user = useAuthStore(state => state.user);

    const handleSearch = (keyword: string) => {
        console.log("검색어 입력됨:", keyword);
    };
    const handleSort = (order: "asc" | "desc") => {
        console.log("정렬 순서 변경됨:", order);
    };

    return (
        /* 바깥쪽 전체 배경 판 */
        <View className="flex-1 w-full items-center bg-bg-default">
            {/* 1. 모바일용 헤더 (768px 미만 && showMainHeader가 true일 때만 노출) */}
            {showMainHeader && (
                <View className="md:hidden w-full">
                    <MainHeader
                        userId={user?.id}
                        userName={user?.nickname ?? ""}
                        onSearch={handleSearch}
                        onSortToggle={handleSort}
                    />
                </View>
            )}

            {/* 2. 데스크탑용 헤더 (768px 이상 && showDesktopHeader가 true일 때만 노출) */}
            {showDesktopHeader && (
                <View className="hidden md:flex w-full">
                    <MainDesktopHeader />
                </View>
            )}
            <View
                className={twMerge([
                    "flex-1",
                    "w-full",
                    "max-w-6xl",
                    "p-6",
                    "self-center",
                    "bg-bg-default",
                ])}>
                <Slot />
            </View>

            {showMainFooter && (
                <View className="md:hidden w-full">
                    <MainFooter />
                </View>
            )}
        </View>
    );
}
