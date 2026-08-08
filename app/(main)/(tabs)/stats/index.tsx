import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Platform, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import Title from "@/components/common/title/Title";
import { router } from "expo-router";
import { GetStatisticsResponse } from "@/types/statistic";
import statsApi from "@/api/user/statsApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ExpirationDetailModal from "@/components/domain/stats/ExpirationDetailModal";
import ConsumptionDetailModal from "@/components/domain/stats/ConsumptionDetailModal";
import ConsumptionStatusCard from "@/components/domain/stats/ConsumptionStatusCard";
import ExpirationSummaryCard from "@/components/domain/stats/ExpirationSummaryCard";
import TopConsumptionCard from "@/components/domain/stats/TopConsumptionCard";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { useSetupLayout } from "@/hooks/useSetupLayout";

type ModalType = "expiringSoon" | "expired" | "consumptionDetail";

interface ModalConfigState {
    visible: boolean;
    type: ModalType;
}

function StatsPage() {
    useSetupLayout({ showDesktopHeader: true });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [statsData, setStatsData] = useState<GetStatisticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { isLoggedIn } = useAuthStore();

    const [modalConfig, setModalConfig] = useState<ModalConfigState>({
        visible: false,
        type: "expiringSoon",
    });

    const year = String(selectedDate.getFullYear());
    // month는 문자열("8") 형태로 추출됩니다.
    const month = String(selectedDate.getMonth() + 1);

    const loadStatsData = useCallback(async () => {
        if (!isLoggedIn) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await statsApi.getStatistics(year, month);
            setStatsData(response);
        } catch (error) {
            console.error("통계 데이터를 불러오는 중 오류 발생:", error);
            const msg = "통계 데이터를 불러오는데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isLoggedIn, month, year]);

    useEffect(() => {
        void loadStatsData();
    }, [loadStatsData]);

    const handleCardPress = (action: () => void) => {
        if (!isLoggedIn) {
            const title = "로그인이 필요해요";
            const msg = "상세 통계 내역을 확인하시려면 먼저 로그인해주세요.";

            if (Platform.OS === "web") {
                if (window.confirm(`${title}\n${msg}`)) {
                    router.push("/auth/login");
                }
            } else {
                Alert.alert(title, msg, [
                    { text: "취소", style: "cancel" },
                    { text: "로그인", onPress: () => router.push("/auth/login") },
                ]);
            }
            return;
        }

        action();
    };

    const handlePrevMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setSelectedDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const openConsumptionModal = () => {
        setModalConfig({ visible: true, type: "consumptionDetail" });
    };

    const openExpiringSoonModal = () => {
        setModalConfig({ visible: true, type: "expiringSoon" });
    };

    const openExpiredModal = () => {
        setModalConfig({ visible: true, type: "expired" });
    };

    const closeModal = () => {
        setModalConfig(prev => ({ ...prev, visible: false }));
    };

    return (
        <View className={twMerge("flex-1 bg-bg-default")}>
            <View className={twMerge("mb-5 relative", "md:hidden")}>
                <Title
                    title="월간 대시보드"
                    textClassName="text-[20px]"
                    showBackButton
                    leftIcon={<Feather name="calendar" size={24} color="#2C2C2C" />}
                    onBackPress={() => {
                        router.push("/shopping");
                    }}
                />
            </View>

            {isLoading ? (
                <LoadingIndicator fullScreen={true} />
            ) : (
                <ScrollView className={twMerge("flex-1")} showsVerticalScrollIndicator={false}>
                    {/* 기존에 있던 MonthSelector 컴포넌트는 삭제했습니다. */}

                    {/* 3. 이번 달 소비/폐기 현황 카드 (Props 추가) */}
                    <ConsumptionStatusCard
                        month={month}
                        totalPrice={statsData?.dashboardData?.totalConsumedPrice || 0}
                        rates={statsData?.dashboardData?.statusRates}
                        onPress={() => handleCardPress(openConsumptionModal)}
                        onPrev={handlePrevMonth}
                        onNext={handleNextMonth}
                    />

                    {/* 4. 임박 / 지난 알림 요약 카드 */}
                    <ExpirationSummaryCard
                        expiringCount={statsData?.dashboardData?.expirationCards?.expiringSoon || 0}
                        expiredCount={statsData?.dashboardData?.expirationCards?.expired || 0}
                        onPressExpiring={() => handleCardPress(openExpiringSoonModal)}
                        onPressExpired={() => handleCardPress(openExpiredModal)}
                    />

                    {/* 5. 가장 많이 소비한 TOP 3 리스트 */}
                    <TopConsumptionCard products={statsData?.dashboardData?.top3Products || []} />
                </ScrollView>
            )}

            <ConsumptionDetailModal
                visible={modalConfig.visible && modalConfig.type === "consumptionDetail"}
                onClose={closeModal}
                data={statsData?.modalData}
                targetMonth={statsData?.targetMonth}
            />

            <ExpirationDetailModal
                visible={
                    modalConfig.visible &&
                    (modalConfig.type === "expiringSoon" || modalConfig.type === "expired")
                }
                type={modalConfig.type as "expiringSoon" | "expired"}
                onClose={closeModal}
                data={
                    modalConfig.type === "expiringSoon"
                        ? statsData?.dashboardData.expirationCards.expiringSoonList || []
                        : statsData?.dashboardData.expirationCards.expiredList || []
                }
            />
        </View>
    );
}

export default StatsPage;
