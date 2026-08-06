import { TouchableOpacity, View, Image } from "react-native";
import { Top3ProductItem } from "@/types/statistic";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Feather } from "@expo/vector-icons";
import { CategoryIconKey, categoryIcons } from "@/constants/categoryIcons";

interface Props {
    products: Top3ProductItem[];
}

export default function TopConsumptionCard({ products }: Props) {
    return (
        <Card>
            <TextComponent className="font-bold text-xl text-text-default mb-5">
                가장 많이 소비한 TOP 3
            </TextComponent>

            {products.map((product, index) => {
                // 백엔드에서 내려온 icon 값 매핑 (매핑 실패 시 기본 tag 아이콘 처리)
                const iconKey = product.icon as CategoryIconKey;
                const imageSource = categoryIcons[iconKey] ?? categoryIcons.tag;

                return (
                    <TouchableOpacity
                        key={product.name}
                        activeOpacity={0.7}
                        className={twMerge(
                            "flex-row items-center justify-between",
                            index !== products.length - 1 && "mb-5",
                        )}>
                        <View className="flex-row items-center gap-4">
                            <View className="relative">
                                <View className="w-14 h-14 bg-bg-subtle rounded-xl items-center justify-center overflow-hidden">
                                    <Image
                                        source={imageSource}
                                        style={{
                                            width: 70,
                                            height: 70,
                                        }}
                                        resizeMode="contain"
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
                );
            })}
        </Card>
    );
}
