import { View } from "react-native";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainFooter from "@/components/layout/main/MainFooter";
import { twMerge } from "tailwind-merge";
import MainHeader from "@/components/layout/main/MainHeader";
import MainDesktopHeader from "@/components/layout/main/MainDesktopHeader";

export default function MainLayout() {
    const { showMainHeader, showDesktopHeader, showMainFooter } = useLayoutStore();

    return (
        /* 바깥쪽 전체 배경 판 */
        <View className="flex-1 w-full items-center bg-bg-default">
            {/* 1. 모바일/태블릿용 헤더 (1024px 미만 && showMainHeader가 true일 때만 노출) */}
            {showMainHeader && (
                <View className="lg:hidden w-full">
                    <MainHeader />
                </View>
            )}

            {/* 2. 데스크탑용 헤더 (1024px 이상 && showDesktopHeader가 true일 때만 노출) */}
            {showDesktopHeader && (
                <View className="hidden lg:flex w-full">
                    <MainDesktopHeader />
                </View>
            )}
            <View
                className={twMerge([
                    "flex-1",
                    "w-full",
                    "max-w-6xl",
                    "px-6 pt-6",
                    "self-center",
                    "bg-bg-default",
                ])}>
                <Slot />
            </View>

            {/* 푸터도 헤더 기준과 동일하게 lg:hidden으로 맞춤 */}
            {showMainFooter && (
                <View className="lg:hidden w-full">
                    <MainFooter />
                </View>
            )}
        </View>
    );
}
