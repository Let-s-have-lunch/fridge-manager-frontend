import { TouchableOpacity, View, Image } from "react-native";
import { Top3ProductItem } from "@/types/statistic";
import Card from "@/components/common/card/Card";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { Feather, Ionicons } from "@expo/vector-icons"; // 👈 빈 화면 아이콘을 위해 Ionicons 추가
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

            {/* 🚨 [추가됨] 데이터가 없을 때의 빈 화면 처리 */}
            {products.length === 0 ? (
                <View className="py-6 items-center justify-center gap-2">
                    <Ionicons name="basket-outline" size={36} color="#BDBDBD" />
                    <TextComponent className="text-text-secondary text-base">
                        이번 달은 아직 소비한 식재료가 없어요.
                    </TextComponent>
                </View>
            ) : (
                /* ✅ [기존 코드] 데이터가 있을 때 리스트 렌더링 */
                products.map((product, index) => {
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
                            <Feather
                                name="chevron-right"
                                size={20}
                                className="text-text-secondary"
                            />
                        </TouchableOpacity>
                    );
                })
            )}
        </Card>
    );
}
