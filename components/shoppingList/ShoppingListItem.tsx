import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ShoppingItem } from "../../types/shoppingList";

interface Props {
    item: ShoppingItem;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
    onUpdate: (id: number, newMemo: string) => void;
}

export const ShoppingListItem: React.FC<Props> = ({ item, onToggle, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMemo, setEditedMemo] = useState(item.memo);

    const handleSave = () => {
        if (!editedMemo.trim()) {
            Alert.alert("알림", "내용을 입력해주세요.");
            return;
        }
        onUpdate(item.id, editedMemo);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedMemo(item.memo);
        setIsEditing(false);
    };

    const formatDisplayDate = (dateStr?: string) => {
        if (!dateStr || dateStr.length < 10) return "26.07.08 pm 08:59";
        return dateStr;
    };

    return (
        /* 🌟 시안과 같은 둥근 알약형 카드 박스 디자인 */
        <View className="bg-white rounded-2xl px-5 py-4 mb-3 shadow-sm border border-[#EBE5DD] flex-row items-center justify-between">
            <TouchableOpacity
                disabled={isEditing}
                onPress={() => !isEditing && onToggle(item.id)}
                activeOpacity={0.7}
                className={`flex-row items-center flex-1 mr-3 ${isEditing ? "opacity-50" : ""}`}>
                {/* 체크박스 */}
                <View
                    className={`w-5 h-5 rounded-[6px] border-2 items-center justify-center shrink-0 ${
                        item.isChecked
                            ? "bg-[#2B2623] border-[#2B2623]"
                            : "border-[#C2BAB2] bg-transparent"
                    }`}>
                    {item.isChecked && (
                        <Text className="text-white font-black text-xs leading-none">✓</Text>
                    )}
                </View>

                {/* 텍스트 및 시간 영역 */}
                <View className="flex-1 ml-4 justify-center">
                    {isEditing ? (
                        <TextInput
                            className="text-base text-[#2B2623] border-b border-[#FF5C46] py-1 font-bold"
                            value={editedMemo}
                            onChangeText={setEditedMemo}
                            autoFocus
                        />
                    ) : (
                        <>
                            <Text
                                className={`text-base font-bold tracking-tight ${
                                    item.isChecked
                                        ? "line-through text-[#A69F98] font-normal"
                                        : "text-[#2B2623]"
                                }`}
                                numberOfLines={1}>
                                {item.memo}
                            </Text>
                            <Text className="text-[11px] text-[#A69F98] mt-0.5 font-medium">
                                {formatDisplayDate(item.date)}
                            </Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>

            {/* 우측 연필/휴지통 아이콘 영역 */}
            <View className="flex-row items-center space-x-2">
                {isEditing ? (
                    <View className="flex-row space-x-2">
                        <TouchableOpacity
                            onPress={handleSave}
                            className="px-3 py-1.5 bg-[#FF5C46] rounded-lg"
                            activeOpacity={0.7}>
                            <Text className="text-white text-xs font-bold">저장</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleCancel}
                            className="px-3 py-1.5 bg-[#EBE5DD] rounded-lg"
                            activeOpacity={0.7}>
                            <Text className="text-[#2B2623] text-xs font-bold">취소</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <TouchableOpacity
                            onPress={() => setIsEditing(true)}
                            className="p-2"
                            activeOpacity={0.7}>
                            <Feather name="edit-2" size={17} color="#8C827A" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => onDelete(item.id)}
                            className="p-2"
                            activeOpacity={0.7}>
                            <Feather name="trash-2" size={17} color="#FF5C46" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};
