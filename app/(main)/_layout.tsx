import { View } from "react-native";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainHeader from "@/components/layout/main/MainHeader";
import MainFooter from "@/components/layout/main/MainFooter";
import { twMerge } from "tailwind-merge";

export default function MainLayout() {
    const { showMainHeader, showMainFooter } = useLayoutStore();

    return (
        <View className="flex-1 bg-bg-default">
            {showMainHeader && <MainHeader />}

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
