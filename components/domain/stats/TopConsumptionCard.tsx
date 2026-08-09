import { TouchableOpacity, View, Image } from "react-native";
import { Top3ProductItem } from "@/types/statistic";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Ionicons } from "@expo/vector-icons";
import { CategoryIconKey, categoryIcons } from "@/constants/categoryIcons";

interface Props {
    products: Top3ProductItem[];
}

export default function TopConsumptionCard({ products }: Props) {
    return (
        <Card>
            <TextComponent className="font-semibold text-[18px] text-text-default mb-5">
                가장 많이 소비한 TOP 3
            </TextComponent>

            {/* 데이터가 없을 때 */}
            {products.length === 0 ? (
                <View className="py-6 items-center justify-center gap-2">
                    <Ionicons name="basket-outline" size={36} color="#BDBDBD" />

                    <TextComponent className="text-text-secondary text-base">
                        이번 달은 아직 소비한 식재료가 없어요.
                    </TextComponent>
                </View>
            ) : (
                products.map((product, index) => {
                    const iconKey = product.icon as CategoryIconKey;
                    const imageSource = categoryIcons[iconKey] ?? categoryIcons.tag;

                    return (
                        <TouchableOpacity
                            key={product.name}
                            activeOpacity={0.7}
                            className={twMerge(
                                "flex-row items-center w-full",
                                index !== products.length - 1 && "mb-5",
                            )}>
                            {/* 순위 + 이미지 */}
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

                                <View className="absolute -top-1 -left-1 bg-success-main w-6 h-6 rounded-full items-center justify-center">
                                    <TextComponent className="text-[14px] font-medium text-bg-paper">
                                        {index + 1}
                                    </TextComponent>
                                </View>
                            </View>

                            {/* 상품 정보 */}
                            <View className="flex-1 ml-4">
                                <TextComponent
                                    className="text-[16px] font-medium text-text-default mb-1"
                                    numberOfLines={1}>
                                    {product.name}
                                </TextComponent>

                                <TextComponent className="text-[14px] text-text-secondary">
                                    {product.useCount}회 사용
                                </TextComponent>
                            </View>

                            {/* 금액 */}
                            <TextComponent className="text-[16px] font-medium text-text-default ml-3">
                                {product.totalPrice.toLocaleString()}원
                            </TextComponent>
                        </TouchableOpacity>
                    );
                })
            )}
        </Card>
    );
}
