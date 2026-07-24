import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
    onAdd: (memo: string) => void;
}

export const AddShoppingItem: React.FC<Props> = ({ onAdd }) => {
    const [memo, setMemo] = useState("");

    const handleAdd = () => {
        if (!memo.trim()) {
            Alert.alert("알림", "할 일을 입력하세요.");
            return;
        }
        onAdd(memo);
        setMemo("");
    };

    return (
        /* 🌟 시안처럼 둥글고 깔끔한 인풋 카드 박스 및 우측 더 세련된 플러스 버튼 적용 */
        <View className="bg-white rounded-2xl px-5 py-3 mb-3 shadow-sm border border-[#EBE5DD] flex-row items-center justify-between">
            <TextInput
                className="flex-1 text-base text-[#2B2623] py-1 font-medium"
                placeholder="할 일을 입력하세요..."
                placeholderTextColor="#A69F98"
                value={memo}
                onChangeText={setMemo}
                onSubmitEditing={handleAdd}
            />
            <TouchableOpacity
                onPress={handleAdd}
                className="w-9 h-9 bg-[#FF5C46] rounded-full items-center justify-center ml-3 shadow-sm"
                activeOpacity={0.8}>
                <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
};
