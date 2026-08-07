import React from "react";
import { View, ScrollView, Pressable, LayoutRectangle } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import { STATUSES, STORAGES, UNITS } from "@/constants/productOptions";

interface Props {
    activeDropdown: string | null;
    dropdownLayout: LayoutRectangle | null;
    currentValue: any;
    onSelect: (id: string, value: any) => void;
    onClose: () => void;
}

export default function DropdownOverlay({
    activeDropdown,
    dropdownLayout,
    currentValue,
    onSelect,
    onClose,
}: Props) {
    if (!activeDropdown || !dropdownLayout) return null;

    const options =
        activeDropdown === "unit"
            ? UNITS
            : activeDropdown === "storageType"
              ? STORAGES
              : activeDropdown === "status"
                ? STATUSES
                : [];

    return (
        <View
            className="absolute z-[9999] rounded-[10px] border border-gray-200 dark:border-gray-700 bg-bg-default shadow-xl overflow-hidden"
            style={{
                top: dropdownLayout.y,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
                maxHeight: 200,
                elevation: 10,
            }}>
            <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                {options.map((option, index) => (
                    <Pressable
                        key={index}
                        className={`px-4 py-3 ${index !== options.length - 1 ? "border-b border-divider" : ""}`}
                        onPress={() => {
                            onSelect(activeDropdown, option.value);
                            onClose();
                        }}>
                        <TextComponent
                            className={`text-[15px] ${currentValue === option.value ? "font-bold text-primary-main" : "text-text-default"}`}>
                            {option.label}
                        </TextComponent>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
