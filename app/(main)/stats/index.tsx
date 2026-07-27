import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import { router } from "expo-router";
import Card from "@/components/common/card/Card";
import { GetStatisticsResponse } from "@/types/statistic";
import statsApi from "@/api/user/statsApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import HalfDonutChart from "@/components/domain/chart/HalfDonutChart";

function StatsPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [statsData, setStatsData] = useState<GetStatisticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const year = String(selectedDate.getFullYear());
    const month = String(selectedDate.getMonth() + 1);

    const loadStatsData = useCallback(async () => {
        try {
            setIsLoading(true);

            const response = await statsApi.getStatistics(year, month);

            setStatsData(response);
        } catch (error) {
            console.log("통계 데이터를 불러오는 중 오류 발생:", error);
            const msg = "통계 데이터를 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [month, year]);

    useEffect(() => {
        loadStatsData().then(() => {});
    }, [loadStatsData]);

    const handlePrevMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    return (
        <View className="flex-1 bg-bg-default">
            {/* 1. 타이틀 헤더 */}
            <View className="relative">
                <Title
                    title="월간 대시보드"
                    showBackButton={true}
                    onBackPress={() => router.back()}
                />
                <TouchableOpacity
                    className="absolute right-5 top-0 bottom-0 justify-center"
                    activeOpacity={0.7}>
                    <Feather name="calendar" size={24} className="text-text-default" />
                </TouchableOpacity>
            </View>

            {isLoading || !statsData ? (
                <LoadingIndicator />
            ) : (
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* 2. 월(Month) 선택 영역 */}
                    <View className="flex-row justify-center items-center py-6 gap-6">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="p-2"
                            onPress={handlePrevMonth}>
                            <Feather
                                name="chevron-left"
                                size={20}
                                className="text-text-secondary"
                            />
                        </TouchableOpacity>
                        <TextComponent className="text-lg font-bold text-text-default">
                            {statsData.targetMonth.replace("-", ".")}
                        </TextComponent>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="p-2"
                            onPress={handleNextMonth}>
                            <Feather
                                name="chevron-right"
                                size={20}
                                className="text-text-secondary"
                            />
                        </TouchableOpacity>
                    </View>
                    `{/* 3. 이번 달 소비/폐기 현황 카드 */}
                    <Card className={"mb-6"}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-row justify-between items-center mb-6">
                            <View className="flex-row items-center gap-2">
                                <Feather
                                    name="shopping-cart"
                                    size={18}
                                    className="text-text-default"
                                />
                                <TextComponent className="font-bold text-xl text-text-default">
                                    이번 달 소비/폐기 현황
                                </TextComponent>
                            </View>
                            <Feather
                                name="chevron-right"
                                size={20}
                                className="text-text-secondary"
                            />
                        </TouchableOpacity>

                        <View className="items-center justify-center py-6 relative">
                            {/* 반원 차트 렌더링 */}
                            <HalfDonutChart
                                consumed={statsData.dashboardData.statusRates.consumed}
                                discarded={statsData.dashboardData.statusRates.discarded}
                                others={statsData.dashboardData.statusRates.others}
                            />

                            {/* 반원 중앙에 텍스트 띄우기 (absolute 활용) */}
                            <View className="absolute bottom-6 items-center">
                                <TextComponent className="text-[13px] text-text-secondary mb-1">
                                    총 소비
                                </TextComponent>
                                <TextComponent className="text-[26px] font-bold text-text-default">
                                    {statsData.dashboardData.totalConsumedPrice.toLocaleString()}원
                                </TextComponent>
                            </View>
                        </View>

                        {/* 범례 (Legend) */}
                        <View className="flex-row justify-between mt-2 px-4">
                            <View className="items-center">
                                <TextComponent className="text-2xl font-bold text-secondary-main">
                                    {statsData.dashboardData.statusRates.consumed}%
                                </TextComponent>
                                <TextComponent className="text-lg text-text-secondary mt-0.5">
                                    소비
                                </TextComponent>
                            </View>
                            <View className="items-center">
                                <TextComponent className="text-2xl font-bold text-primary-main">
                                    {statsData.dashboardData.statusRates.discarded}%
                                </TextComponent>
                                <TextComponent className="text-lg text-text-secondary mt-0.5">
                                    폐기
                                </TextComponent>
                            </View>
                            <View className="items-center">
                                <TextComponent className="text-2xl font-bold text-success-main">
                                    {statsData.dashboardData.statusRates.others}%
                                </TextComponent>
                                <TextComponent className="text-lg text-text-secondary mt-0.5">
                                    기타
                                </TextComponent>
                            </View>
                        </View>
                    </Card>
                    {/* 4. 임박 / 지난 알림 요약 카드 */}
                    <Card className="flex-row mb-6 gap-3">
                        <View className="flex-1 bg-[#FFF5F4] border border-[#FCE1DE] rounded-[20px] py-4 items-center justify-center gap-1">
                            <View className="flex-row items-baseline gap-3">
                                <Feather name="clock" size={20} className="text-error-point" />
                                <TextComponent className="text-xl font-bold text-text-secondary">
                                    임박
                                </TextComponent>
                            </View>
                            <TextComponent className="text-3xl font-bold text-error-point">
                                {statsData.dashboardData.expirationCards.expiringSoon}개
                            </TextComponent>
                        </View>
                        <View className="flex-1 bg-[#FFFBF3] border border-[#FBEAC1] rounded-[20px] py-4 items-center justify-center gap-1">
                            <View className="flex-row items-baseline gap-3">
                                <Feather
                                    name="alert-triangle"
                                    size={20}
                                    className="text-warning-main"
                                />
                                <TextComponent className="text-xl font-bold text-text-secondary">
                                    지난
                                </TextComponent>
                            </View>
                            <TextComponent className="text-3xl font-bold text-warning-main">
                                {statsData.dashboardData.expirationCards.expired}개
                            </TextComponent>
                        </View>
                    </Card>
                    {/* 5. 가장 많이 소비한 TOP 3 리스트 */}
                    <Card>
                        <TextComponent className="font-bold text-xl text-text-default mb-5">
                            가장 많이 소비한 TOP 3
                        </TextComponent>

                        {statsData.dashboardData.top3Products.map((product, index) => (
                            <TouchableOpacity
                                key={product.name}
                                activeOpacity={0.7}
                                className={twMerge(
                                    "flex-row items-center justify-between",
                                    index !== statsData.dashboardData.top3Products.length - 1 &&
                                        "mb-5",
                                )}>
                                <View className="flex-row items-center gap-4">
                                    <View className="relative">
                                        <View className="w-12 h-12 bg-bg-subtle rounded-xl items-center justify-center">
                                            {/* 2. Feather를 MaterialCommunityIcons로 변경! */}
                                            <MaterialCommunityIcons
                                                name={product.icon as any}
                                                size={22}
                                                className="text-text-secondary"
                                            />
                                        </View>
                                        <View className="absolute -top-1 -left-1 bg-warning-main w-6 h-6 rounded-full items-center justify-center">
                                            <TextComponent className="text-lg font-bold text-bg-paper">
                                                {index + 1}
                                            </TextComponent>
                                        </View>
                                    </View>
                                    {/* 상품 정보 */}
                                    <View>
                                        <TextComponent className="text-xl font-bold text-text-default mb-1">
                                            {product.name}
                                        </TextComponent>
                                        <View className="flex-row items-center">
                                            <TextComponent className="text-lg text-text-secondary">
                                                {product.useCount}회 사용
                                            </TextComponent>
                                            <View className="w-[1px] h-4 bg-divider mx-2" />
                                            <TextComponent className="text-lg text-text-secondary">
                                                {product.totalPrice.toLocaleString()}원
                                            </TextComponent>
                                        </View>
                                    </View>
                                </View>
                                <Feather
                                    name="chevron-right"
                                    size={20}
                                    className="text-text-secondary"
                                />
                            </TouchableOpacity>
                        ))}
                    </Card>
                </ScrollView>
            )}
        </View>
    );
}

export default StatsPage;
