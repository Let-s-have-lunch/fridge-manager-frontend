import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";

interface Props {
    targetMonth: string;
    onPrev: () => void;
    onNext: () => void;
}

export default function MonthSelector({ targetMonth, onPrev, onNext }: Props) {
    return (
        <View className="flex-row justify-center items-center py-6 gap-6">
            <TouchableOpacity activeOpacity={0.7} className="p-2" onPress={onPrev}>
                <Feather name="chevron-left" size={20} className="text-text-secondary" />
            </TouchableOpacity>
            <TextComponent className="text-lg font-bold text-text-default">
                {targetMonth.replace("-", ".")}
            </TextComponent>
            <TouchableOpacity activeOpacity={0.7} className="p-2" onPress={onNext}>
                <Feather name="chevron-right" size={20} className="text-text-secondary" />
            </TouchableOpacity>
        </View>
    );
}
