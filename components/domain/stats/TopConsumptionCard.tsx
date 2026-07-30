import { TouchableOpacity, View } from "react-native";
import { Top3ProductItem } from "@/types/statistic";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
    products: Top3ProductItem[];
}

export default function TopConsumptionCard({ products }: Props) {
    return (
        <Card>
            <TextComponent className="font-bold text-xl text-text-default mb-5">
                가장 많이 소비한 TOP 3
            </TextComponent>

            {products.map((product, index) => (
                <TouchableOpacity
                    key={product.name}
                    activeOpacity={0.7}
                    className={twMerge(
                        "flex-row items-center justify-between",
                        index !== products.length - 1 && "mb-5",
                    )}>
                    <View className="flex-row items-center gap-4">
                        <View className="relative">
                            <View className="w-12 h-12 bg-bg-subtle rounded-xl items-center justify-center">
                                {/* 2. Feather를 MaterialCommunityIcons로 변경! */}
                                <MaterialCommunityIcons
                                    name={product.icon as any}
                                    size={22}
                                    className="text-text-secondary"
                                />
                            </View>
                            <View className="absolute -top-1 -left-1 bg-warning-main w-6 h-6 rounded-full items-center justify-center">
                                <TextComponent className="text-lg font-bold text-bg-paper">
                                    {index + 1}
                                </TextComponent>
                            </View>
                        </View>
                        {/* 상품 정보 */}
                        <View>
                            <TextComponent className="text-xl font-bold text-text-default mb-1">
                                {product.name}
                            </TextComponent>
                            <View className="flex-row items-center">
                                <TextComponent className="text-lg text-text-secondary">
                                    {product.useCount}회 사용
                                </TextComponent>
                                <View className="w-[1px] h-4 bg-divider mx-2" />
                                <TextComponent className="text-lg text-text-secondary">
                                    {product.totalPrice.toLocaleString()}원
                                </TextComponent>
                            </View>
                        </View>
                    </View>
                    <Feather name="chevron-right" size={20} className="text-text-secondary" />
                </TouchableOpacity>
            ))}
        </Card>
    );
}
