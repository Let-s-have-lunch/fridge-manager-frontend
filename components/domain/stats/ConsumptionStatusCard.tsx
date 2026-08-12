import { TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import React from "react";
import HalfDonutChart from "@/components/domain/stats/HalfDonutChart";

interface Props {
    month: string;
    totalPrice: number;
    rates?: {
        consumed: number;
        discarded: number;
        others: number;
    };
    onPress: () => void;
    onPrev: () => void;
    onNext: () => void;
}

export default function ConsumptionStatusCard({
    month,
    totalPrice = 0,
    rates = { consumed: 0, discarded: 0, others: 0 },
    onPress,
    onPrev,
    onNext,
}: Props) {
    return (
        <Card className="mb-4">
            {/* 타이틀 헤더 영역 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                className="flex-row items-center mb-5 gap-2">
                <View className="flex-row items-center gap-2">
                    <Feather name="shopping-cart" size={18} className="text-text-default" />
                    <TextComponent className="text-[18px] font-semibold text-text-default">
                        {month}월 소비/폐기 현황
                    </TextComponent>
                </View>
                <Feather name="help-circle" size={20} className="text-text-secondary" />
            </TouchableOpacity>

            {/* 그래프와 좌우 버튼 영역 */}
            <View className="relative w-full">
                {/* 그래프 */}
                <View className="items-center">
                    <HalfDonutChart
                        consumed={rates.consumed}
                        discarded={rates.discarded}
                        others={rates.others}
                    />
                </View>

                {/* 왼쪽 화살표 */}
                <TouchableOpacity
                    onPress={onPrev}
                    activeOpacity={0.6}
                    className="absolute left-2 top-[42%] p-2 z-10" // <-- z-10 추가
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Feather name="chevron-left" size={28} className="text-text-secondary" />
                </TouchableOpacity>

                {/* 오른쪽 화살표 */}
                <TouchableOpacity
                    onPress={onNext}
                    activeOpacity={0.6}
                    className="absolute right-2 top-[42%] p-2 z-10" // <-- z-10 추가
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Feather name="chevron-right" size={28} className="text-text-secondary" />
                </TouchableOpacity>

                {/* 중앙 텍스트 */}
                <View className="absolute bottom-6 left-0 right-0 items-center">
                    <TextComponent className="text-[16px] font-semibold text-text-secondary mb-1">
                        총 소비
                    </TextComponent>

                    <TextComponent className="text-[20px] font-semibold text-text-default">
                        {totalPrice.toLocaleString()}원
                    </TextComponent>
                </View>
            </View>

            {/* 범례 (Legend) */}
            <View className="flex-row justify-between px-4 mt-1 mb-2">
                <View className="items-center">
                    <TextComponent className="text-lg font-bold text-text-secondary mt-0.5">
                        소비
                    </TextComponent>
                    <TextComponent className="text-2xl font-semibold color-[#6faee3]">
                        {rates.consumed}%
                    </TextComponent>
                </View>
                <View className="items-center">
                    <TextComponent className="text-lg font-semibold text-text-secondary mt-0.5">
                        폐기
                    </TextComponent>
                    <TextComponent className="text-2xl font-bold color-[#e89270]">
                        {rates.discarded}%
                    </TextComponent>
                </View>
                <View className="items-center">
                    <TextComponent className="text-lg font-semibold text-text-secondary mt-0.5">
                        기타
                    </TextComponent>
                    <TextComponent className="text-2xl font-bold  color-[#93b48d] ">
                        {rates.others}%
                    </TextComponent>
                </View>
            </View>
        </Card>
    );
}
