import { Image, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TextComponent from "@/components/common/text/TextComponent";
import ExpireBadge, { ExpireStatusType } from "@/components/common/badge/Badge";
import { Product, StorageType } from "@/types/product";
import { CategoryIconKey, categoryIcons } from "@/constants/categoryIcons";

interface ProductCardProps {
    product: Product;
    onPress?: () => void;
}

const storageLabel: Record<StorageType, string> = {
    REFRIGERATED: "냉장",
    FROZEN: "냉동",
    ROOM_TEMP: "실온",
};

const getExpireStatus = (dDay: number): ExpireStatusType => {
    if (dDay < 0) return "expired";
    if (dDay <= 3) return "soon";
    if (dDay <= 7) return "warning";
    return "safe";
};

const getDDayLabel = (dDay: number) => {
    if (dDay < 0) return `D+${Math.abs(dDay)}`;
    if (dDay === 0) return "D-Day";
    return `D-${dDay}`;
};

const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("ko-KR").replace(/\.\s/g, ".");

export default function ProductCard({ product, onPress }: ProductCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className="mb-4 flex-row items-center rounded-[28px] bg-bg-paper p-5 shadow-sm">

            <View className="mr-5 h-20 w-20 items-center justify-center rounded-full bg-bg-button overflow-hidden">
                <Image
                    source={categoryIcons[product.category.icon as keyof typeof categoryIcons]}
                    style={{
                        width: 84,
                        height: 84,
                    }}
                    resizeMode="contain"
                />
            </View>

            <View className="flex-1 gap-1.5">
                <TextComponent numberOfLines={1} className="text-base font-bold text-text-default">
                    {product.name}
                </TextComponent>

                <View className="flex-row items-center">
                    <View className="rounded-full bg-secondary-contrast px-3 py-1">
                        <TextComponent className="text-xs font-semibold text-secondary-point">
                            {storageLabel[product.storageType]}
                        </TextComponent>
                    </View>

                    <TextComponent className="ml-2 text-sm font-medium text-text-secondary">
                        {product.category.name}
                    </TextComponent>
                </View>

                <View className="flex-row items-center">
                    <Ionicons name="calendar-outline" size={15} color="#777777" />

                    <TextComponent className="ml-2 text-xs text-text-secondary">
                        {formatDate(product.expirationDate)}
                    </TextComponent>
                </View>
            </View>

            <View className="ml-4 self-stretch items-end justify-center">
                <ExpireBadge status={getExpireStatus(product.dDay)}>
                    {getDDayLabel(product.dDay)}
                </ExpireBadge>
            </View>
        </Pressable>
    );
}
