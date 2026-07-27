import React from "react";
import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, FlatList } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { ExpirationListItem } from "@/types/statistic";

interface Props {
    visible: boolean;
    type: "expiringSoon" | "expired";
    onClose: () => void;
    data: ExpirationListItem[];
}

export default function ExpirationDetailModal({ visible, type, onClose, data }: Props) {
    const isExpiring = type === "expiringSoon";

    // 타입에 따라 타이틀과 테마 색상을 자동으로 변경합니다.
    const title = isExpiring ? "유통기한 임박 상품" : "유통기한 지난 상품";
    const textColor = isExpiring ? "text-error-point" : "text-warning-main";

    // 리스트 아이템 배경색 (StatsPage의 카드 색상과 깔맞춤)
    const itemBgColor = isExpiring ? "bg-[#FFF5F4]" : "bg-[#FFFBF3]";
    const itemBorderColor = isExpiring ? "border-[#FCE1DE]" : "border-[#FBEAC1]";

    // 1. 리스트 아이템 렌더링 함수
    const renderItem = ({ item }: { item: ExpirationListItem }) => (
        <View
            className={`flex-row items-center p-4 mb-3 border rounded-[20px] ${itemBgColor} ${itemBorderColor}`}>
            <View className="w-12 h-12 bg-bg-paper rounded-xl items-center justify-center mr-4">
                <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    className="text-text-secondary"
                />
            </View>
            <View className="flex-1">
                <TextComponent className="text-lg font-bold text-text-default mb-1">
                    {item.name}
                </TextComponent>
                <TextComponent className="text-[15px] text-text-secondary">
                    {/* 날짜를 보기 좋게 포맷팅 (예: 2024-05-20) */}
                    {new Date(item.expirationDate).toISOString().split("T")[0]} 까지
                </TextComponent>
            </View>
        </View>
    );

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose} // 안드로이드 물리 뒤로가기 버튼 처리
        >
            {/* 1. 반투명 배경 (누르면 모달 닫힘) */}
            <TouchableWithoutFeedback onPress={onClose}>
                <View className="flex-1 bg-black/50 justify-end">
                    {/* 2. 바텀 시트 컨테이너 (이 영역은 눌러도 안 닫히게 e.stopPropagation 처리) */}
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View className="bg-bg-default rounded-t-[36px] px-6 pt-8 pb-10 min-h-[50%] max-h-[85%]">
                            {/* 헤더: 타이틀과 닫기 버튼 */}
                            <View className="flex-row justify-between items-center mb-6">
                                <View className="flex-row items-center gap-2">
                                    <Feather
                                        name={isExpiring ? "clock" : "alert-triangle"}
                                        size={22}
                                        className={textColor}
                                    />
                                    <TextComponent className={`text-2xl font-bold ${textColor}`}>
                                        {title}
                                    </TextComponent>
                                </View>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="p-2 -mr-2"
                                    activeOpacity={0.7}>
                                    <Feather name="x" size={24} className="text-text-secondary" />
                                </TouchableOpacity>
                            </View>

                            {/* 컨텐츠 영역: 데이터가 있을 때와 없을 때를 구분 */}
                            {data.length > 0 ? (
                                <FlatList
                                    data={data}
                                    keyExtractor={item => String(item.id)}
                                    renderItem={renderItem}
                                    showsVerticalScrollIndicator={false}
                                    // 마지막 아이템이 바닥에 딱 붙지 않도록 여백 제공
                                    contentContainerStyle={{ paddingBottom: 20 }}
                                />
                            ) : (
                                /* 데이터가 0개일 때의 똑똑한 빈 화면 (Empty State) 처리 */
                                <View className="flex-1 items-center justify-center py-10">
                                    <Feather
                                        name="check-circle"
                                        size={48}
                                        className="text-success-main mb-4"
                                    />
                                    <TextComponent className="text-lg text-text-secondary text-center leading-relaxed">
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
