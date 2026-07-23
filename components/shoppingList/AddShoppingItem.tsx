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
            className={`flex-row items-center py-3.5 border-b transition-all ${
                isFocused ? "border-primary-main" : "border-divider"
            }`}>
            {/* 왼쪽 빈 체크박스 (노트북 라인 감성 매칭) */}
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

            {/* 🌟 입력할 때만 나타나는 미니멀 등록 버튼 (평소엔 숨김 처리로 깔끔함 극대화) */}
            <TouchableOpacity
                onPress={handleSubmit}
                disabled={!text.trim()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className={`ml-2 p-1 transition-opacity ${
                    !text.trim() ? "opacity-0" : "opacity-100"
                }`}>
                <Text className="text-primary-main font-bold text-lg">+</Text>
            </TouchableOpacity>
        </View>
    );
};
