import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import formattingUtil from "@/utils/formattingUtil";
import { useSetupLayout } from "@/hooks/useSetupLayout";
import shoppingListApi from "@/api/user/shoppingListApi";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { ShoppingItem } from "@/types/shoppingList";

export default function ShoppingCalendarScreen() {
    useSetupLayout({ showDesktopHeader: true });

    const router = useRouter();
    const { isLoggedIn } = useAuthStore();

    // 달력 상단에 보여줄 현재 기준 월
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    // 달력에서 클릭한 날짜
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [calendarHeight, setCalendarHeight] = useState(0);

    // 장보기 데이터 리스트 (ShoppingItem[])
    const [shoppingData, setShoppingData] = useState<ShoppingItem[]>([]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 💡 날짜 비교 함수
    const isSameDate = (dbDate: string | Date, targetDateStr: string) => {
        if (!dbDate) return false;
        try {
            const d = new Date(dbDate);
            return formattingUtil.formatDateString(d) === targetDateStr;
        } catch {
            return false;
        }
    };

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

    // 💡 실제 백엔드 API(getShoppingItems)를 활용해 달력 표출용 데이터 조회
    const fetchShoppingData = useCallback(
        async (gridDates: Date[]) => {
            if (!isLoggedIn) return;

            try {
                // 달력에 표시되는 날짜들을 병렬(Promise.all)로 조회
                const promises = gridDates.map(async day => {
                    const dateStr = formattingUtil.formatDateString(day);
                    try {
                        const items = await shoppingListApi.getShoppingItems(dateStr);
                        return items || [];
                    } catch {
                        return [];
                    }
                });

                const results = await Promise.all(promises);
                // 2차원 배열을 1차원 배열로 평탄화
                setShoppingData(results.flat());
            } catch (error) {
                console.error("장보기 데이터 로드 실패:", error);
                setShoppingData([]);
            }
        },
        [isLoggedIn],
    );

    // 화면 진입 및 연/월 변경 시 자동 데이터 갱신
    useFocusEffect(
        useCallback(() => {
            const grid = getDaysInMonthGrid(year, month);
            void fetchShoppingData(grid);
        }, [year, month, fetchShoppingData]),
    );

    const ROW_GAP = 8;

    const calculatedCellHeight =
        calendarHeight > 0 ? Math.floor((calendarHeight - ROW_GAP * 5) / 6) : 80;
    const cellHeight = Math.max(calculatedCellHeight, 70);

    // 월 이동 핸들러
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
        <View className="flex-1 bg-bg-default py-5">
            {/* 1. 달력 상단: 연/월 표시 및 이동 버튼 */}
            <View className="flex-row justify-center items-center mb-9">
                <TouchableOpacity onPress={handlePrevMonth} className="p-2" activeOpacity={0.7}>
                    <Feather
                        name="chevron-left"
                        size={20}
                        className="text-text-secondary font-bold"
                    />
                </TouchableOpacity>
                <TextComponent className="text-[22px] font-bold text-text-default px-4">
                    {year}년 {month + 1}월
                </TextComponent>
                <TouchableOpacity onPress={handleNextMonth} className="p-2" activeOpacity={0.7}>
                    <Feather
                        name="chevron-right"
                        size={20}
                        className="text-text-secondary font-bold"
                    />
                </TouchableOpacity>
            </View>

            {/* 2. 달력 헤더: 요일 표시 */}
            <View className="flex-row justify-between mb-5">
                {WEEKDAYS.map((day, idx) => (
                    <View
                        key={idx}
                        className={`w-[13%] py-1.5 items-center justify-center rounded-lg border border-divider ${day.bgClass}`}>
                        <TextComponent className={`text-[15px] font-bold ${day.textClass}`}>
                            {day.label}
                        </TextComponent>
                    </View>
                ))}
            </View>

            {/* 3. 달력 그리드 영역 */}
            <ScrollView
                className="flex-1"
                onLayout={e => {
                    setCalendarHeight(e.nativeEvent.layout.height);
                }}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap justify-between">
                    {calendarGrid.map((day, idx) => {
                        const isCurrentMonth = day.getMonth() === month;
                        const isSunday = day.getDay() === 0;
                        const isSaturday = day.getDay() === 6;
                        const totalRows = Math.ceil(calendarGrid.length / 7);
                        const row = Math.floor(idx / 7);
                        const isLastRow = row === totalRows - 1;

                        const dateStr = formattingUtil.formatDateString(day);
                        const isSelected = dateStr === selectedDateStr;
                        const isToday = dateStr === formattingUtil.formatDateString(new Date());

                        // 💡 해당 날짜에 장보기 항목이 존재하는지 체크
                        const hasShoppingList = shoppingData.some(item =>
                            isSameDate(item.date, dateStr),
                        );

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
                                    router.push(`/shopping/list?date=${dateStr}`);
                                }}
                                activeOpacity={0.7}
                                style={{
                                    height: cellHeight,
                                    marginBottom: isLastRow ? 0 : ROW_GAP,
                                }}
                                className={`w-[13%] rounded-[10px] items-center justify-start p-2 ${
                                    isSelected
                                        ? "bg-primary-main"
                                        : isToday
                                          ? "bg-primary-light"
                                          : isCurrentMonth
                                            ? "bg-bg-paper"
                                            : "bg-transparent"
                                }`}>
                                {/* 날짜 숫자 */}
                                <TextComponent className={`text-[15px] ${dayTextClass}`}>
                                    {day.getDate()}
                                </TextComponent>

                                {/* 💡 장보기 일정이 있을 때 나타나는 primary-main 동그라미 점 */}
                                {hasShoppingList && (
                                    <View
                                        className={`mt-1.5 h-2 w-2 rounded-full ${
                                            isSelected ? "bg-white" : "bg-primary-main"
                                        }`}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}
