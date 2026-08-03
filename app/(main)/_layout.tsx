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
            {/* 1. 모바일용 헤더 (768px 미만 && showMainHeader가 true일 때만 노출) */}
            {showMainHeader && (
                <View className="md:hidden w-full">
                    <MainHeader />
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
                    "px-6 pt-6",
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
