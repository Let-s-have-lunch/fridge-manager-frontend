import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ShoppingItem } from "../../types/shoppingList";

interface Props {
    item: ShoppingItem;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const ShoppingListItem: React.FC<Props> = ({ item, onToggle, onDelete }) => {
    // 메모 내용을 이름과 수량으로 자연스럽게 분리 (예: "무 1개" -> ["무", "1개"])
    const parts = item.memo.split(" ");
    const name = parts[0] || item.memo;
    const count = parts.slice(1).join(" ") || "";

    return (
        <View className="flex-row items-center justify-between py-3.5 border-b border-divider">
            {/* 왼쪽: 체크박스 + 식재료 이름 */}
            <TouchableOpacity
                onPress={() => onToggle(item.id)}
                activeOpacity={0.7}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: item.isChecked }}
                className="flex-row items-center flex-1 mr-2"
            >
                <View
                    className={`w-5 h-5 rounded border items-center justify-center shrink-0 ${
                        item.isChecked
                            ? "bg-primary-main border-primary-main"
                            : "border-divider bg-bg-paper"
                    }`}
                >
                    {item.isChecked && (
                        <Text className="text-primary-contrast font-bold text-xs">✓</Text>
                    )}
                </View>

                {/* 🌟 글자가 너무 길면 말줄임표(...)로 처리하여 레이아웃 방어 */}
                <Text
                    className={`text-base ml-3 flex-1 ${
                        item.isChecked
                            ? "line-through text-text-secondary font-normal"
                            : "text-text font-medium"
                    }`}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {name}
                </Text>
            </TouchableOpacity>

            {/* 오른쪽: 수량 정보 + 삭제 버튼 */}
            <View className="flex-row items-center shrink-0">
                {count ? (
                    <Text
                        className={`text-base mr-4 ${
                            item.isChecked ? "text-text-secondary opacity-60" : "text-text-secondary"
                        }`}
                    >
                        {count}
                    </Text>
                ) : null}

                <TouchableOpacity
                    onPress={() => onDelete(item.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    accessibilityRole="button"
                    accessibilityLabel="삭제"
                    className="p-1"
                >
                    <Text className="text-text-secondary font-bold text-sm">✕</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};