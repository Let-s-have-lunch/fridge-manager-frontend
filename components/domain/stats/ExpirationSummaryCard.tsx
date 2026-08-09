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
        <Card className={twMerge("flex-row mb-4 gap-3")}>
            {/* 임박 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPressExpiring}
                className="flex-1 bg-warning-bg rounded-[20px] py-3.5 px-3 items-center justify-center">
                <View className="flex-row items-center">
                    <Feather name="clock" size={18} className="text-warning-main" />

                    <TextComponent className="text-[17px] font-semibold text-text-default ml-2">
                        임박
                    </TextComponent>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={17}
                        className="text-warning-main ml-1"
                    />
                </View>

                <TextComponent className="text-2xl font-semibold text-warning-main mt-2">
                    {expiringCount}개
                </TextComponent>
            </TouchableOpacity>

            {/* 지난 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPressExpired}
                className="flex-1 bg-error-bg rounded-[20px] py-3.5 px-3 items-center justify-center">
                <View className="flex-row items-center">
                    <Feather name="alert-triangle" size={18} className="text-error-point" />

                    <TextComponent className="text-[17px] font-semibold text-text-default ml-2">
                        지난
                    </TextComponent>

                    <MaterialCommunityIcons
                        name="information-outline"
                        size={17}
                        className="text-error-point ml-1"
                    />
                </View>

                <TextComponent className="text-2xl font-semibold text-error-point mt-2">
                    {expiredCount}개
                </TextComponent>
            </TouchableOpacity>
        </Card>
    );
}
