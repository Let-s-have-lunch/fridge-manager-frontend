import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ShoppingItem } from "../../types/shoppingList";

interface Props {
    item: ShoppingItem;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const ShoppingListItem: React.FC<Props> = ({ item, onToggle, onDelete }) => {
    return (
        <View className="flex-row items-center justify-between py-3.5 border-b border-divider bg-bg-paper">
            {/* 왼쪽 체크박스 + 텍스트 영역 */}
            <TouchableOpacity
                onPress={() => onToggle(item.id)}
                activeOpacity={0.7}
                className="flex-row items-center flex-1 mr-2">
                {/* 커스텀 체크박스 UI (Cozy Coral 메인 컬러 적용) */}
                <View
                    className={`w-5 h-5 rounded border items-center justify-center shrink-0 ${
                        item.isChecked
                            ? "bg-primary-main border-primary-main"
                            : "border-divider bg-bg-paper"
                    }`}>
                    {item.isChecked && (
                        <Text className="text-primary-contrast font-bold text-xs">✓</Text>
                    )}
                </View>

                {/*
                  🌟 [수정 포인트] flex-1 추가!
                  글자가 길어져도 삭제 버튼을 밀어내지 않고 자연스럽게 줄바꿈되도록 방어합니다.
                */}
                <Text
                    className={`text-base ml-3 flex-1 ${
                        item.isChecked
                            ? "line-through text-text-secondary font-normal"
                            : "text-text font-medium"
                    }`}>
                    {item.memo}
                </Text>
            </TouchableOpacity>

            {/* 오른쪽 삭제 버튼 (shrink-0으로 찌그러짐 방지) */}
            <TouchableOpacity
                onPress={() => onDelete(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="p-1 shrink-0">
                <Text className="text-text-secondary font-bold text-sm">✕</Text>
            </TouchableOpacity>
        </View>
    );
};
