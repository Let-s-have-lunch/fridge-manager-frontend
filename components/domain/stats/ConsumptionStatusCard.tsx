import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import React from "react";
import HalfDonutChart from "@/components/domain/chart/HalfDonutChart";

interface Props {
    totalPrice: number;
    rates: {
        consumed: number;
        discarded: number;
        others: number;
    };
    onPress: () => void;
}

export default function ConsumptionStatusCard({totalPrice, rates, onPress}: Props) {
    return (
        <Card className={"mb-6"}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center gap-2">
                    <Feather name="shopping-cart" size={18} className="text-text-default" />
                    <TextComponent className="font-bold text-xl text-text-default">
                        이번 달 소비/폐기 현황
                    </TextComponent>
                </View>
                <Feather name="chevron-right" size={20} className="text-text-secondary" />
            </TouchableOpacity>

            <View className="items-center justify-center py-6 relative">
                {/* 반원 차트 렌더링 */}
                <HalfDonutChart
                    consumed={rates.consumed}
                    discarded={rates.discarded}
                    others={rates.others}
                />

                {/* 반원 중앙에 텍스트 띄우기 (absolute 활용) */}
                <View className="absolute bottom-6 items-center">
                    <TextComponent className="text-[13px] text-text-secondary mb-1">
                        총 소비
                    </TextComponent>
                    <TextComponent className="text-[26px] font-bold text-text-default">
                        {totalPrice.toLocaleString()}원
                    </TextComponent>
                </View>
            </View>

            {/* 범례 (Legend) */}
            <View className="flex-row justify-between mt-2 px-4">
                <View className="items-center">
                    <TextComponent className="text-2xl font-bold text-secondary-main">
                        {rates.consumed}%
                    </TextComponent>
                    <TextComponent className="text-lg text-text-secondary mt-0.5">
                        소비
                    </TextComponent>
                </View>
                <View className="items-center">
                    <TextComponent className="text-2xl font-bold text-primary-main">
                        {rates.discarded}%
                    </TextComponent>
                    <TextComponent className="text-lg text-text-secondary mt-0.5">
                        폐기
                    </TextComponent>
                </View>
                <View className="items-center">
                    <TextComponent className="text-2xl font-bold text-success-main">
                        {rates.others}%
                    </TextComponent>
                    <TextComponent className="text-lg text-text-secondary mt-0.5">
                        기타
                    </TextComponent>
                </View>
            </View>
        </Card>
    );
}