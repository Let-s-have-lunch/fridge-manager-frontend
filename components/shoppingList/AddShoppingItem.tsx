import React, { useState } from "react";
import { View, TextInput } from "react-native";

interface Props {
    onAdd: (memo: string) => void;
}

export const AddShoppingItem: React.FC<Props> = ({ onAdd }) => {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text.trim()) return;
        onAdd(text.trim());
        setText("");
    };

    return (
        <View className="flex-row items-center py-4 border-b border-[#EFECE6]">
            {/* 왼쪽 두꺼운 체크박스 */}
            <View className="w-5 h-5 rounded-[5px] border-2 border-[#2B2623] shrink-0 bg-transparent" />

            {/* 🌟 [핵심 수정] mr-6 여백을 싹 지워서(mr-0) 밑줄이 위쪽 '1개' 글자 오른쪽 끝까지 시원하게 뻗어 나갑니다! */}
            <View
                className="flex-1 ml-4 mr-0 pb-1"
                style={{
                    borderBottomWidth: 2.5,
                    borderBottomColor: "#555555",
                }}>
                <TextInput
                    value={text}
                    onChangeText={setText}
                    onSubmitEditing={handleSubmit}
                    returnKeyType="done"
                    placeholder=""
                    className="text-base text-[#2B2623] p-0 m-0 font-bold leading-5 w-full"
                />
            </View>
        </View>
    );
};
