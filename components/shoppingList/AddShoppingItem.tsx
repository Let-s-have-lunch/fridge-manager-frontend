import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

interface Props {
    onAdd: (memo: string) => void;
}

export const AddShoppingItem: React.FC<Props> = ({ onAdd }) => {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = () => {
        if (!text.trim()) return;
        onAdd(text.trim());
        setText("");
    };

    return (
        <View
            className={`flex-row items-center py-3.5 border-b ${
                isFocused ? "border-primary-main" : "border-divider"
            }`}>
            {/* 왼쪽 빈 체크박스 (실선 테두리로 아이템과 통일감 부여) */}
            <View className="w-5 h-5 rounded border border-divider shrink-0 mr-3 bg-background-paper" />

            {/* 입력 영역 */}
            <TextInput
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="구매할 식재료 입력 (예: 무 1개)"
                placeholderTextColor="#C9C1BA"
                className="flex-1 text-base text-text p-0 m-0"
            />

            {/* 등록 버튼 */}
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!text.trim()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className={`ml-2 p-1 ${!text.trim() ? "opacity-30" : "opacity-100"}`}>
                <Text className="text-primary-main font-bold text-lg">+</Text>
            </TouchableOpacity>
        </View>
    );
};
