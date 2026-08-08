import React from "react";
import {
    Modal,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    useWindowDimensions,
    Pressable,
    Image, // 👈 Image 컴포넌트 임포트 추가
} from "react-native";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { ExpirationListItem } from "@/types/statistic";
import { useSwipeDown } from "@/hooks/useSwipeDown";
import { twMerge } from "tailwind-merge";
import { CategoryIconKey, categoryIcons } from "@/constants/categoryIcons"; // 👈 카테고리 아이콘 임포트 추가

interface Props {
    visible: boolean;
    type: "expiringSoon" | "expired";
    onClose: () => void;
    data: ExpirationListItem[];
}

export default function ExpirationDetailModal({ visible, type, onClose, data }: Props) {
    const { width } = useWindowDimensions();
    const isMd = width >= 768;

    const isExpiring = type === "expiringSoon";

    const swipeDownHandlers = useSwipeDown(onClose);

    const title = isExpiring ? "유통기한 임박 상품" : "유통기한 지난 상품";
    const textColor = isExpiring ? "text-warning-main" : "text-error-point";
    const itemBgColor = isExpiring ? "bg-warning-bg" : "bg-error-bg";
    const itemBorderColor = isExpiring ? "border-warning-border" : "border-error-border";

    // 1. 리스트 아이템 렌더링 함수
    const renderItem = ({ item }: { item: ExpirationListItem }) => {
        // 💡 백엔드에서 내려온 icon 값을 이용해 이미지 소스 매핑 (실패 시 기본 tag)
        const iconKey = item.icon as CategoryIconKey;
        const imageSource = categoryIcons[iconKey] ?? categoryIcons.tag;

        return (
            <View
                className={twMerge(
                    "flex-row items-center p-4 mb-3 border rounded-[20px]",
                    itemBgColor,
                    itemBorderColor,
                )}>
                <View
                    className={twMerge(
                        "bg-bg-paper rounded-xl items-center justify-center mr-4 overflow-hidden",
                    )}>
                    {/* 💡 MaterialCommunityIcons 대신 Image로 교체 */}
                    <Image
                        source={imageSource}
                        style={{ width: 50, height: 50 }}
                        resizeMode="contain"
                    />
                </View>
                <View className={twMerge("flex-1")}>
                    <TextComponent className={twMerge("text-lg font-bold text-text-default mb-1")}>
                        {item.name}
                    </TextComponent>
                    <TextComponent className={twMerge("text-[15px] text-text-secondary")}>
                        {new Date(item.expirationDate).toISOString().split("T")[0]} 까지
                    </TextComponent>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={isMd ? "fade" : "slide"}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View
                    className={twMerge(
                        "flex-1 bg-black/50 justify-end md:justify-center md:items-center",
                    )}>
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View
                            className={twMerge(
                                "bg-bg-paper px-6 pt-8 pb-10 w-full min-h-[50%] max-h-[85%] rounded-t-[36px] md:max-w-[450px] md:rounded-[36px] md:min-h-0",
                            )}>
                            {!isMd && (
                                <View
                                    {...swipeDownHandlers}
                                    className={twMerge("w-full items-center pb-6 -mt-2")}>
                                    <Pressable
                                        onPress={onClose}
                                        className={twMerge(
                                            "w-full items-center cursor-pointer py-2",
                                        )}>
                                        <View
                                            className={twMerge(
                                                "w-12 h-1.5 bg-gray-400 rounded-full",
                                            )}
                                        />
                                    </Pressable>
                                </View>
                            )}
                            <View className={twMerge("flex-row justify-between items-center mb-6")}>
                                <View className={twMerge("flex-row items-center gap-2")}>
                                    {/* 💡 타이틀 옆의 아이콘도 필요시 이미지로 변경 가능 (현재는 기존 유지 또는 tag 적용 가능) */}
                                    <Feather
                                        name={isExpiring ? "clock" : "alert-triangle"}
                                        size={22}
                                        className={textColor}
                                    />
                                    <TextComponent
                                        className={twMerge("text-xl font-bold text-center text-text-default",)}>
                                        {title}
                                    </TextComponent>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className={twMerge("p-2 -mr-2")}
                                    activeOpacity={0.7}>
                                    <Feather
                                        name="x"
                                        size={24}
                                        className={twMerge("text-text-secondary")}
                                    />
                                </TouchableOpacity>
                            </View>

                            {data.length > 0 ? (
                                <FlatList
                                    data={data}
                                    keyExtractor={item => String(item.id)}
                                    renderItem={renderItem}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                />
                            ) : (
                                <View
                                    className={twMerge("flex-1 items-center justify-center py-10")}>
                                    <Feather
                                        name="check-circle"
                                        size={40}
                                        className={twMerge("text-success-main mb-4")}
                                    />
                                    <TextComponent
                                        className={twMerge(
                                            "text-base text-text-secondary text-center leading-relaxed",
                                        )}>
                                        해당하는 상품이 없습니다.{"\n"}냉장고 관리를 아주 잘하고
                                        계시네요!
                                    </TextComponent>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
