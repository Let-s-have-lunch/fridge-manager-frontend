import React from "react";
import { View, TextInput } from "react-native";

interface Props {
    onAdd: (memo: string) => void;
    value?: string;
    onChangeText?: (text: string) => void;
}

export const AddShoppingItem: React.FC<Props> = ({ onAdd, value, onChangeText }) => {
    return (
        <View className="bg-white rounded-2xl px-5 py-3 mb-3 shadow-sm border border-[#EBE5DD] flex-row items-center justify-between">
            <TextInput
                className="flex-1 text-base text-[#2B2623] py-1 font-medium"
                placeholder="할 일을 입력하세요..."
                placeholderTextColor="#A69F98"
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={() => value && onAdd(value)}
            />
        </View>
    );
};
