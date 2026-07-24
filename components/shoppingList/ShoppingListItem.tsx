import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { ShoppingItem } from "../../types/shoppingList";

interface Props {
    item: ShoppingItem;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const ShoppingListItem: React.FC<Props> = ({ item, onToggle, onDelete }) => {
    const parts = item.memo ? item.memo.split(" ") : [];
    const name = item.name || parts[0] || item.memo || "";
    const count = item.quantity || parts.slice(1).join(" ") || "";

    const handleLongPress = () => {
        Alert.alert("항목 삭제", `'${name}'을(를) 리스트에서 삭제하시겠습니까?`, [
            { text: "취소", style: "cancel" },
            { text: "삭제", style: "destructive", onPress: () => onDelete(item.id) },
        ]);
    };

    return (
        /* 🌟 사진처럼 은은하고 연한 구분선(border-[#EFECE6]) 적용 */
        <View className="flex-row items-center justify-between py-4 border-b border-[#EFECE6]">
            <TouchableOpacity
                onPress={() => onToggle(item.id)}
                onLongPress={handleLongPress}
                activeOpacity={0.7}
                className="flex-row items-center flex-1"
            >
                {/* 🌟 border-2로 선 굵기 2배 강화, rounded-[5px]로 사진 속 네모 모양 일치 */}
                <View
                    className={`w-5 h-5 rounded-[5px] border-2 items-center justify-center shrink-0 ${
                        item.isChecked
                            ? "bg-[#2B2623] border-[#2B2623]"
                            : "border-[#2B2623] bg-transparent"
                    }`}
                >
                    {item.isChecked && (
                        <Text className="text-white font-black text-xs leading-none">✓</Text>
                    )}
                </View>

                {/* 🌟 ml-4로 체크박스와 글자 사이에 16px 여백을 강제 적용해 절대 붙지 않음 */}
                <Text
                    className={`text-base ml-4 flex-1 ${
                        item.isChecked
                            ? "line-through text-[#A69F98] font-normal"
                            : "text-[#2B2623] font-bold"
                    }`}
                    numberOfLines={1}
                >
                    {name}
                </Text>
            </TouchableOpacity>

            {/* 오른쪽 끝에 수량('1개') 깔끔하게 정렬 */}
            {count ? (
                <Text
                    className={`text-base font-bold ml-2 ${
                        item.isChecked ? "text-[#A69F98] line-through font-normal" : "text-[#2B2623]"
                    }`}
                >
                    {count}
                </Text>
            ) : null}
        </View>
    );
};