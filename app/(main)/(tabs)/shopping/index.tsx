import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import formattingUtil from "@/utils/formattingUtil";


export default function ShoppingCalendarScreen() {
    const router = useRouter();

    // 달력 상단에 보여줄 현재 기준 월
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    // 달력에서 클릭한 날짜
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 💡 달력 한 판(그리드)을 그리기 위한 날짜 배열 생성 함수
    const getDaysInMonthGrid = (targetYear: number, targetMonth: number) => {
        const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
        const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);

        const firstDayOfWeek = firstDayOfMonth.getDay();
        const grid: Date[] = [];

        // 이전 달 날짜 채우기
        const prevMonthLastDay = new Date(targetYear, targetMonth, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            grid.push(new Date(targetYear, targetMonth - 1, prevMonthLastDay - i));
        }

        // 이번 달 날짜 채우기
        const totalDays = lastDayOfMonth.getDate();
        for (let i = 1; i <= totalDays; i++) {
            grid.push(new Date(targetYear, targetMonth, i));
        }

        // 다음 달 날짜 채우기 (총 42칸을 맞추기 위해)
        const remaining = 42 - grid.length;
        for (let i = 1; i <= remaining; i++) {
            grid.push(new Date(targetYear, targetMonth + 1, i));
        }

        return grid;
    };

    const calendarGrid = getDaysInMonthGrid(year, month);
    const selectedDateStr = formattingUtil.formatDateString(selectedDate);

    // 💡 월 이동 핸들러
    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const WEEKDAYS = [
        {
            label: "sun",
            textClass: "text-text-default",
            bgClass: "bg-error-main border-error-main",
        },
        {
            label: "mon",
            textClass: "text-text-default",
            bgClass: "bg-bg-paper border-divider",
        },
        {
            label: "tue",
            textClass: "text-text-default",
            bgClass: "bg-bg-paper border-divider",
        },
        {
            label: "wed",
            textClass: "text-text-default",
            bgClass: "bg-bg-paper border-divider",
        },
        {
            label: "thu",
            textClass: "text-text-default",
            bgClass: "bg-bg-paper border-divider",
        },
        {
            label: "fri",
            textClass: "text-text-default",
            bgClass: "bg-bg-paper border-divider",
        },
        {
            label: "sat",
            textClass: "text-text-default",
            bgClass: "bg-secondary-main border-secondary-main",
        },
    ];

    return (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-bg-default pt-6">
            {/* 1. 달력 상단: 연/월 표시 및 이동 버튼 */}
            <View className="flex-row justify-center items-center mb-6">
                <TouchableOpacity onPress={handlePrevMonth} className="p-2" activeOpacity={0.7}>
                    <Feather
                        name="chevron-left"
                        size={20}
                        className="text-text-default font-bold"
                    />
                </TouchableOpacity>
                <TextComponent className="text-xl font-bold text-text-default px-4">
                    {year}년 {month + 1}월
                </TextComponent>
                <TouchableOpacity onPress={handleNextMonth} className="p-2" activeOpacity={0.7}>
                    <Feather
                        name="chevron-right"
                        size={20}
                        className="text-text-default font-bold"
                    />
                </TouchableOpacity>
            </View>

            {/* 2. 달력 헤더: 요일 표시 */}
            <View className="flex-row justify-between mb-3">
                {WEEKDAYS.map((day, idx) => (
                    <View
                        key={idx}
                        className={`w-[13%] py-1.5 items-center justify-center rounded-lg border border-divider ${day.bgClass}`}>
                        <TextComponent className={`text-xs font-bold ${day.textClass}`}>
                            {day.label}
                        </TextComponent>
                    </View>
                ))}
            </View>

            {/* 3. 달력 그리드: 날짜 버튼들 */}
            <View className="flex-row flex-wrap justify-between gap-y-2 mb-10">
                {calendarGrid.map((day, idx) => {
                    const isCurrentMonth = day.getMonth() === month;
                    const isSunday = day.getDay() === 0;
                    const isSaturday = day.getDay() === 6;

                    const dateStr = formattingUtil.formatDateString(day);
                    const isSelected = dateStr === selectedDateStr;
                    const isToday = dateStr === formattingUtil.formatDateString(new Date());

                    // 선택 여부, 주말, 이번 달 여부에 따른 텍스트 색상 처리
                    let dayTextClass = "text-text-default font-semibold";
                    if (isSelected) {
                        dayTextClass = "text-primary-contrast font-bold";
                    } else if (!isCurrentMonth) {
                        dayTextClass = "text-text-secondary opacity-50";
                    } else if (isSunday) {
                        dayTextClass = "text-error-point font-bold";
                    } else if (isSaturday) {
                        dayTextClass = "text-secondary-point font-bold";
                    }

                    return (
                        <TouchableOpacity
                            key={idx}
                            onPress={() => {
                                setSelectedDate(day);
                                // 💡 날짜를 클릭하면 쿼리스트링과 함께 리스트 페이지로 이동!
                                router.push(`/shopping/list?date=${dateStr}`);
                            }}
                            activeOpacity={0.7}
                            className={`w-[13%] aspect-[1/1.2] rounded-[10px] items-center justify-center ${
                                isSelected
                                    ? "bg-primary-main" // 선택된 날짜 배경
                                    : isToday
                                      ? "bg-primary-light" // 오늘 날짜 배경
                                      : isCurrentMonth
                                        ? "bg-bg-subtle"
                                        : "bg-transparent"
                            }`}>
                            <TextComponent className={`text-[15px] ${dayTextClass}`}>
                                {day.getDate()}
                            </TextComponent>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}
