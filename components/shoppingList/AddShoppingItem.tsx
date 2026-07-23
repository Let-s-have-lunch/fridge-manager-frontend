import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

interface Props {
    onAdd: (memo: string) => void;
}

export const AddShoppingItem: React.FC<Props> = ({ onAdd }) => {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false); // 🌟 입력창 포커스 상태 관리

    const handleSubmit = () => {
        if (!text.trim()) return;
        onAdd(text.trim()); // 🌟 앞뒤 공백 제거 후 전달
        setText("");
    };

    return (
        <View className="flex-row items-center py-3">
            {/* 왼쪽 빈 점선 체크박스 스티치 (찌그러짐 방지 shrink-0) */}
            <View className="w-5 h-5 rounded border border-dashed border-divider shrink-0 mr-3" />

            {/* 밑줄 디자인 영역 (포커스 여부에 따라 테두리 색상 동적 변경) */}
            <View
                className={`flex-1 flex-row items-center border-b py-1 ${
                    isFocused ? "border-primary-main" : "border-divider"
                }`}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done" // 🌟 모바일 키보드 완료 버튼 활성화
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="구매할 식재료 입력 (예: 무 1개)"
                    placeholderTextColor="#C9C1BA" // text-text-secondary 물감 색상
                    className="flex-1 text-base text-text p-0 m-0"
                />

                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!text.trim()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    className={`ml-2 p-1 ${!text.trim() ? "opacity-30" : "opacity-100"}`}>
                    <Text className="text-primary-main font-bold text-lg">+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
