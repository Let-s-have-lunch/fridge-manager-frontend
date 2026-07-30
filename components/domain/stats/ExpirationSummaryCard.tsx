import TextComponent from "@/components/common/text/TextComponent";
import { TouchableOpacity, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";

interface Props {
    expiringCount: number;
    expiredCount: number;
    onPressExpiring: () => void;
    onPressExpired: () => void;
}

export default function ExpirationSummaryCard({
    expiringCount,
    expiredCount,
    onPressExpiring,
    onPressExpired,
}: Props) {
    return (
        <Card className={twMerge("flex-row mb-6 gap-3")}>
            {/* --- 임박 카드 (노란색/Warning 테마로 변경) --- */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPressExpiring}
                className={twMerge(
                    "flex-1 bg-[#FFFBF3] border border-[#FBEAC1] rounded-[20px] py-4 items-center justify-center gap-1",
                )}>
                <View className={twMerge("flex-row items-center gap-1")}>
                    <Feather name="clock" size={18} className={twMerge("text-warning-main")} />
                    <TextComponent
                        className={twMerge("text-xl font-bold text-text-secondary ml-2")}>
                        임박
                    </TextComponent>
                    <MaterialCommunityIcons
                        name="information-outline"
                        size={18}
                        className={twMerge("text-warning-main opacity-60 ml-0.5")}
                    />
                </View>

                <TextComponent className={twMerge("text-3xl font-bold text-warning-main mt-1")}>
                    {expiringCount}개
                </TextComponent>
            </TouchableOpacity>

            {/* --- 지난 카드 (빨간색/Error 테마로 변경) --- */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPressExpired}
                className={twMerge(
                    "flex-1 bg-[#FFF5F4] border border-[#FCE1DE] rounded-[20px] py-4 items-center justify-center gap-1",
                )}>
                <View className={twMerge("flex-row items-center gap-1")}>
                    <Feather
                        name="alert-triangle"
                        size={18}
                        className={twMerge("text-error-point")}
                    />
                    <TextComponent
                        className={twMerge("text-xl font-bold text-text-secondary ml-2")}>
                        지난
                    </TextComponent>
                    <MaterialCommunityIcons
                        name="information-outline"
                        size={18}
                        className={twMerge("text-error-point opacity-60 ml-0.5")}
                    />
                </View>
                <TextComponent className={twMerge("text-3xl font-bold text-error-point mt-1")}>
                    {expiredCount}개
                </TextComponent>
            </TouchableOpacity>
        </Card>
    );
}
