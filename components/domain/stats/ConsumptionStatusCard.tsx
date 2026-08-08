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
        <Card className="mb-6">
            {/* 타이틀 헤더 영역 */}
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onPress}
                className="flex-row items-center mb-6 gap-2">
                <View className="flex-row items-center gap-2">
                    <Feather name="shopping-cart" size={18} className="text-text-default" />
                    <TextComponent className="text-xl font-bold text-text-default">
                        {month}월 소비/폐기 현황
                    </TextComponent>
                </View>
                <Feather name="help-circle" size={20} className="text-text-secondary" />
            </TouchableOpacity>

            {/* 그래프와 좌우 버튼 영역 */}
            <View className="flex-row items-center justify-between px-2 w-full">
                {/*
                  수정 포인트 1: 이전 달(<) 버튼
                  zIndex와 elevation으로 차트보다 앞으로 배치하고, hitSlop으로 터치 영역을 크게 잡습니다.
                */}
                <TouchableOpacity
                    onPress={onPrev}
                    className="p-2"
                    activeOpacity={0.6}
                    style={{ zIndex: 10, elevation: 10 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Feather name="chevron-left" size={28} className="text-text-secondary" />
                </TouchableOpacity>

                {/* 반원 차트 렌더링 영역 (zIndex를 1로 낮춰 버튼과 겹치지 않게 합니다) */}
                <View
                    className="relative flex-1 items-center justify-center pt-2 pb-6"
                    style={{ zIndex: 1 }}>
                    <HalfDonutChart
                        consumed={rates.consumed}
                        discarded={rates.discarded}
                        others={rates.others}
                    />

                    {/* 반원 중앙에 텍스트 띄우기 */}
                    <View className="absolute bottom-6 items-center">
                        <TextComponent className="text-[15px] font-semibold text-text-secondary mb-1">
                            총 소비
                        </TextComponent>
                        <TextComponent className="text-[20px] font-semibold text-text-default">
                            {totalPrice.toLocaleString()}원
                        </TextComponent>
                    </View>
                </View>

                {/*
                  수정 포인트 2: 다음 달(>) 버튼
                  마찬가지로 터치 우선순위와 영역을 확보합니다.
                */}
                <TouchableOpacity
                    onPress={onNext}
                    className="p-2"
                    activeOpacity={0.6}
                    style={{ zIndex: 10, elevation: 10 }}
                    hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Feather name="chevron-right" size={28} className="text-text-secondary" />
                </TouchableOpacity>
            </View>

            {/* 범례 (Legend) */}
            <View className="flex-row justify-between px-4 mt-2 mb-3">
                <View className="items-center">
                    <TextComponent className="text-lg font-bold text-text-secondary mt-0.5">
                        소비
                    </TextComponent>
                    <TextComponent className="text-2xl font-semibold text-secondary-main">
                        {rates.consumed}%
                    </TextComponent>
                </View>
                <View className="items-center">
                    <TextComponent className="text-lg font-semibold text-text-secondary mt-0.5">
                        폐기
                    </TextComponent>
                    <TextComponent className="text-2xl font-bold text-primary-main">
                        {rates.discarded}%
                    </TextComponent>
                </View>
                <View className="items-center">
                    <TextComponent className="text-lg font-semibold text-text-secondary mt-0.5">
                        기타
                    </TextComponent>
                    <TextComponent className="text-2xl font-bold text-success-main">
                        {rates.others}%
                    </TextComponent>
                </View>
            </View>
        </Card>
    );
}
