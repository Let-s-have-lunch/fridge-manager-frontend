import React from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    // 보여줄 페이지 번호 그룹 계산 (예: 최대 5개씩 표시)
    const maxPageButtons = 5;
    const currentGroup = Math.ceil(currentPage / maxPageButtons);
    const startPage = (currentGroup - 1) * maxPageButtons + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <View className="flex-row justify-center items-center py-4 gap-2">
            {/* 이전 그룹으로 이동 */}
            <Pressable
                disabled={currentPage === 1}
                onPress={() => onPageChange(currentPage - 1)}
                className={twMerge(
                    "p-2 rounded-xl bg-bg-subtle border border-divider justify-center items-center",
                    currentPage === 1 && "opacity-40",
                )}>
                <Feather name="chevron-left" size={18} color="#777777" />
            </Pressable>

            {/* 페이지 번호 버튼들 */}
            {pageNumbers.map(num => {
                const isSelected = num === currentPage;
                return (
                    <Pressable
                        key={num}
                        onPress={() => onPageChange(num)}
                        className={twMerge(
                            "w-9 h-9 rounded-xl justify-center items-center border",
                            isSelected
                                ? "bg-primary-main border-primary-main"
                                : "bg-bg-subtle border-divider",
                        )}>
                        <TextComponent
                            className={twMerge(
                                "text-sm font-bold",
                                isSelected ? "text-white" : "text-text-secondary",
                            )}>
                            {num}
                        </TextComponent>
                    </Pressable>
                );
            })}

            {/* 다음 그룹으로 이동 */}
            <Pressable
                disabled={currentPage === totalPages}
                onPress={() => onPageChange(currentPage + 1)}
                className={twMerge(
                    "p-2 rounded-xl bg-bg-subtle border border-divider justify-center items-center",
                    currentPage === totalPages && "opacity-40",
                )}>
                <Feather name="chevron-right" size={18} color="#777777" />
            </Pressable>
        </View>
    );
}
