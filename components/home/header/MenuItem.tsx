import { Pressable, View, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";


interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bg: string;
    title: string;
    subTitle: string;
    onPress: () => void;
    isLast?: boolean;
}

export default function MenuItem({ icon, color, bg, title, subTitle, onPress, isLast }: MenuItemProps) {
    return (
        <Pressable
            onPress={onPress}
            className={twMerge(
                "flex-row items-center px-6 py-5 active:bg-bg-subtle",
                !isLast && "border-b border-divider",
            )}>
            <View
                style={{ backgroundColor: bg }}
                className="mr-4 h-14 w-14 items-center justify-center rounded-full">
                <Ionicons name={icon} size={28} color={color} />
            </View>

            <View className="flex-1">
                <Text className="text-[18px] font-bold text-text-default">{title}</Text>

                <Text className="mt-1 text-[15px] text-text-secondary">{subTitle}</Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#9A9A9A" />
        </Pressable>
    );
}
