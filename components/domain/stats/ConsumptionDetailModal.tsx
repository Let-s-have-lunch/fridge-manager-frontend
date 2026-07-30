import React from "react";
import {
    Modal,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useWindowDimensions,
    Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { ModalResponse } from "@/types/statistic";
import { useSwipeDown } from "@/hooks/useSwipeDown";
import CategoryDonutChart from "@/components/domain/stats/CategoryDonutChart";
import { twMerge } from "tailwind-merge";
import { CHART_BG_CLASSES, CHART_HEX_COLORS } from "@/constants/chart";

interface Props {
    visible: boolean;
    onClose: () => void;
    data?: ModalResponse;
    targetMonth?: string;
}

export default function ConsumptionDetailModal({ visible, onClose, data, targetMonth }: Props) {
    const { width } = useWindowDimensions();
    const isMd = width >= 768;

    const swipeDownHandlers = useSwipeDown(onClose);

    // 데이터가 로딩되기 전 렌더링 방지
    if (!data) return null;

    // "2026-07" -> "2026.07.01 - 2026.07.31" 변환 로직
    let dateRange = "";
    if (targetMonth) {
        const [year, month] = targetMonth.split("-");
        // 자바스크립트 Date에서 month 인덱스에 그대로 넣고 0일을 구하면 이전 달의 마지막 날이 나옵니다.
        const lastDay = new Date(Number(year), Number(month), 0).getDate();
        dateRange = `${year}.${month.padStart(2, "0")}.01 - ${year}.${month.padStart(2, "0")}.${lastDay}`;
    }

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={isMd ? "fade" : "slide"}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    className={twMerge(
                        "flex-1 justify-end bg-black/50 md:justify-center md:items-center",
                    )}>
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View
                            className={twMerge(
                                "w-full min-h-[50%] px-6 pt-8 pb-12 bg-bg-default rounded-t-[36px] md:max-w-[450px] md:min-h-0 md:rounded-[36px]",
                            )}>
                            {!isMd && (
                                <View
                                    {...swipeDownHandlers}
                                    className={twMerge("w-full items-center pb-6 -mt-2")}>
                                    <Pressable
                                        onPress={onClose}
                                        className={twMerge(
                                            "w-full items-center cursor-pointer py-2",
                                        )}>
                                        <View
                                            className={twMerge(
                                                "w-12 h-1.5 bg-gray-400 rounded-full",
                                            )}
                                        />
                                    </Pressable>
                                </View>
                            )}

                            {/* 헤더 영역 (타이틀 + 기간 + X 버튼) */}
                            <View className={twMerge("flex-row justify-between items-start mb-6")}>
                                <View>
                                    <TextComponent
                                        className={twMerge("text-2xl font-bold text-text-default")}>
                                        이번 달 소비 내역
                                    </TextComponent>
                                    <TextComponent
                                        className={twMerge(
                                            "text-[15px] text-text-secondary mt-1.5",
                                        )}>
                                        {dateRange}
                                    </TextComponent>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className={twMerge("p-2 -mr-2")}
                                    activeOpacity={0.7}>
                                    <Feather name="x" size={24} className="text-text-secondary" />
                                </TouchableOpacity>
                            </View>

                            {/* 차트 & 범례 영역 */}
                            <View className={twMerge("flex-row items-center my-4")}>
                                {/* 도넛 차트 */}
                                <View className="mr-6">
                                    <CategoryDonutChart
                                        data={data.categoryChartData}
                                        totalPrice={data.totalConsumedPrice}
                                        colors={CHART_HEX_COLORS}
                                    />
                                </View>

                                {/* 범례 (Legend) 리스트 */}
                                <View className={twMerge("flex-1 justify-center gap-3.5")}>
                                    {data.categoryChartData.map((item, index) => (
                                        <View
                                            key={index}
                                            className="flex-row items-center justify-between">
                                            <View className="flex-row items-center">
                                                <View
                                                    className={twMerge(
                                                        "w-2.5 h-2.5 rounded-full mr-2.5",
                                                        CHART_BG_CLASSES[
                                                            index % CHART_BG_CLASSES.length
                                                        ],
                                                    )}
                                                />
                                                <TextComponent
                                                    className={twMerge(
                                                        "text-[15px] text-text-secondary",
                                                    )}>
                                                    {item.name}
                                                </TextComponent>
                                            </View>
                                            <TextComponent
                                                className={twMerge(
                                                    "text-[15px] font-bold text-text-default",
                                                )}>
                                                {item.price.toLocaleString()}원
                                            </TextComponent>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            <View className={twMerge("w-full h-[1px] bg-divider my-7")} />

                            {/* 절약 효과 영역 */}
                            <View>
                                <TextComponent
                                    className={twMerge("text-xl font-bold text-text-default")}>
                                    절약 효과
                                </TextComponent>
                                <TextComponent
                                    className={twMerge("text-[14px] text-text-secondary mt-1")}>
                                    이번 달 예상 절약액
                                </TextComponent>

                                <View
                                    className={twMerge(
                                        "flex-row justify-between items-center mt-3",
                                    )}>
                                    <TextComponent
                                        className={twMerge(
                                            "text-3xl font-bold",
                                            data.savingEffect.isPositive
                                                ? "text-success-point"
                                                : "text-error-point",
                                        )}>
                                        {data.savingEffect.amount.toLocaleString()}원
                                    </TextComponent>

                                    {/* 퍼센트 뱃지 */}
                                    <View
                                        className={twMerge(
                                            "px-4 py-1.5 rounded-full",
                                            data.savingEffect.isPositive
                                                ? "bg-[#E8F3E7]"
                                                : "bg-[#FCE1DE]",
                                        )}>
                                        <TextComponent
                                            className={twMerge(
                                                "text-lg font-bold",
                                                data.savingEffect.isPositive
                                                    ? "text-success-point"
                                                    : "text-error-point",
                                            )}>
                                            {data.savingEffect.percentage}
                                        </TextComponent>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
