import React from "react";
import { View } from "react-native";
import Svg, { G, Circle } from "react-native-svg";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";

export interface CategoryChartItem {
    name: string;
    price: number;
}

interface Props {
    data: CategoryChartItem[];
    totalPrice: number;
    colors: string[];
}

export default function CategoryDonutChart({ data, totalPrice, colors }: Props) {
    const size = 130;
    const strokeWidth = 16;
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    // 카테고리별 비중(%)에 따라 원호(Stroke)의 길이를 계산합니다.
    let accumulatedAngle = 0;

    return (
        <View
            className={twMerge("relative items-center justify-center")}
            style={{ width: size, height: size }}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* 개별 속성 대신 웹 표준 방식인 transform 속성을 사용합니다 */}
                <G transform={`rotate(-90, ${center}, ${center})`}>
                    {/* 데이터가 없을 때 뜰 기본 배경 원 */}
                    {totalPrice === 0 ? (
                        <Circle
                            cx={center}
                            cy={center}
                            r={radius}
                            stroke="#ECE6DF"
                            strokeWidth={strokeWidth}
                            fill="transparent"
                        />
                    ) : (
                        data.map((item, index) => {
                            const percentage = item.price / totalPrice;
                            const strokeDasharray = `${circumference * percentage} ${circumference}`;
                            const strokeDashoffset = -accumulatedAngle;

                            // 다음 조각이 시작할 위치 쌓기
                            accumulatedAngle += circumference * percentage;
                            const color = colors[index % colors.length];

                            return (
                                <Circle
                                    key={index}
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke={color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    fill="transparent"
                                />
                            );
                        })
                    )}
                </G>
            </Svg>

            {/* 원 중앙 텍스트 */}
            <View className={twMerge("absolute items-center justify-center")}>
                <TextComponent className={twMerge("text-[11px] text-text-secondary")}>
                    총 소비
                </TextComponent>
                <TextComponent className={twMerge("text-sm font-bold text-text-default mt-0.5")}>
                    {totalPrice.toLocaleString()}원
                </TextComponent>
            </View>
        </View>
    );
}
