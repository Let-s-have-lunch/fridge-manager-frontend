import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const MaskingTape = () => (
    <View className="items-center z-10 -mb-4" style={{ transform: [{ rotate: "-40deg" }] }}>
        <View className="flex-row items-center opacity-85">
            <View className="justify-between h-[24px] py-[1px]">
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-l-full border-l border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-l-full border-l border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-l-full border-l border-y border-[#F5D3B8]" />
            </View>
            <View
                style={{
                    width: 40,
                    height: 24,
                    backgroundColor: "#FDE8D8",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#F5D3B8",
                }}
            />
            <View className="justify-between h-[24px] py-[1px]">
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-r-full border-r border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-r-full border-r border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-r-full border-r border-y border-[#F5D3B8]" />
            </View>
        </View>
    </View>
);

export default function ShoppingCalendarScreen() {
    const router = useRouter();

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const formatDateString = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
    };

    const getDaysInMonthGrid = (targetYear: number, targetMonth: number) => {
        const firstDayOfMonth = new Date(targetYear, targetMonth, 1);
        const lastDayOfMonth = new Date(targetYear, targetMonth + 1, 0);

        const firstDayOfWeek = firstDayOfMonth.getDay();
        const grid: Date[] = [];

        const prevMonthLastDay = new Date(targetYear, targetMonth, 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            grid.push(new Date(targetYear, targetMonth - 1, prevMonthLastDay - i));
        }

        const totalDays = lastDayOfMonth.getDate();
        for (let i = 1; i <= totalDays; i++) {
            grid.push(new Date(targetYear, targetMonth, i));
        }

        const remaining = 42 - grid.length;
        for (let i = 1; i <= remaining; i++) {
            grid.push(new Date(targetYear, targetMonth + 1, i));
        }

        return grid;
    };

    const calendarGrid = getDaysInMonthGrid(year, month);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const WEEKDAYS = [
        { label: "일" },
        { label: "월" },
        { label: "화" },
        { label: "수" },
        { label: "목" },
        { label: "금" },
        { label: "토" },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <View className="w-full max-w-[400px] flex-1 bg-white flex-col justify-between shadow-sm">
                <View className="flex-row items-center px-6 py-4 bg-white">
                    <Text className="text-lg font-bold text-[#2B2623]">장보기 달력</Text>
                </View>

                <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
                    <MaskingTape />

                    <View className="bg-[#FFFDF9] rounded-[32px] px-5 py-6 shadow-sm border border-[#EBE5DD] mb-10">
                        <View className="flex-row justify-between items-center mb-4 px-2">
                            <TouchableOpacity
                                onPress={handlePrevMonth}
                                className="p-2"
                                activeOpacity={0.7}>
                                <Feather name="chevron-left" size={20} color="#2B2623" />
                            </TouchableOpacity>
                            <Text className="text-lg font-black text-[#2B2623]">
                                {year}년 {month + 1}월
                            </Text>
                            <TouchableOpacity
                                onPress={handleNextMonth}
                                className="p-2"
                                activeOpacity={0.7}>
                                <Feather name="chevron-right" size={20} color="#2B2623" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-between mb-3">
                            {WEEKDAYS.map((day, idx) => {
                                let colorClass = "text-[#8C827A]";
                                if (idx === 0) colorClass = "text-[#FF5C46]";
                                if (idx === 6) colorClass = "text-[#A69F98]";
                                return (
                                    <View
                                        key={idx}
                                        className="w-[13%] py-1 items-center justify-center">
                                        <Text className={`text-xs font-bold ${colorClass}`}>
                                            {day.label}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View className="flex-row flex-wrap justify-between gap-y-2">
                            {calendarGrid.map((day, idx) => {
                                const isCurrentMonth = day.getMonth() === month;
                                const isSelected =
                                    selectedDate.toDateString() === day.toDateString();
                                const isToday =
                                    formatDateString(day) === formatDateString(new Date());
                                const dateStr = formatDateString(day);

                                let dayTextClass = "text-[#2B2623] font-semibold";
                                if (isSelected) {
                                    dayTextClass = "text-white font-bold";
                                } else if (!isCurrentMonth) {
                                    dayTextClass = "text-[#C2BAB2] opacity-50";
                                } else if (day.getDay() === 0) {
                                    dayTextClass = "text-[#FF5C46] font-bold";
                                } else if (day.getDay() === 6) {
                                    dayTextClass = "text-[#8C827A] font-bold";
                                }

                                return (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => {
                                            setSelectedDate(day);
                                            router.push(`/shopping-list/list?date=${dateStr}`);
                                        }}
                                        activeOpacity={0.7}
                                        className={`w-[13%] aspect-[1/1.2] rounded-[10px] items-center justify-center ${
                                            isSelected
                                                ? "bg-[#FF5C46] shadow-sm"
                                                : isToday
                                                  ? "bg-[#FDE2C8]"
                                                  : "bg-transparent"
                                        }`}>
                                        <Text className={`text-[13px] ${dayTextClass}`}>
                                            {day.getDate()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                <View className="flex-row justify-around items-center py-3 bg-white border-t border-[#F0EBE3] w-full">
                    <TouchableOpacity className="items-center" activeOpacity={0.7}>
                        <AntDesign name="home" size={24} color="#666666" />
                        <Text className="text-xs text-[#666666] mt-1 font-bold">홈</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center" activeOpacity={0.7}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={26}
                            color="#FF5C46"
                        />
                        <Text className="text-xs text-[#FF5C46] font-bold mt-1">목록</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center" activeOpacity={0.7}>
                        <AntDesign name="bar-chart" size={24} color="#666666" />
                        <Text className="text-xs text-[#666666] mt-1 font-bold">통계</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
