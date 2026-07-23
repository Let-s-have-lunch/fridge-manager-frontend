import { View, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/Text";

interface Props {
    title: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    description?: string;
    className?: string;
}

function Title({
    title,
    showBackButton = false,
    onBackPress,
    description,
    className,
}: Props) {
    return (
        <View
            className={twMerge(
                // 높이는 적당한 헤더 높이(h-14 = 56px)로 조정하고, 중앙 정렬을 위한 기본 세팅
                "w-full h-14 justify-center bg-transparent relative border-divider",
                className,
            )}>
            {/* 1. 중앙 타이틀 영역 (항상 정중앙에 위치) */}
            <View className="items-center justify-center px-16 pointer-events-none">
                <TextComponent
                    className={twMerge(
                        "text-text-default",
                        "font-bold",
                        "text-[18px]", // 이미지 비율에 맞는 적당한 텍스트 크기
                    )}
                    numberOfLines={1}>
                    {title}
                </TextComponent>
                {description && (
                    <TextComponent className="text-sm text-text-secondary mt-0.5" numberOfLines={1}>
                        {description}
                    </TextComponent>
                )}
            </View>

            {/* 2. 좌측 뒤로 가기 버튼 (px는 20px로 설정) */}
            {showBackButton && (
                <TouchableOpacity
                    onPress={onBackPress}
                    // absolute를 이용해 왼쪽 20px 위치에 고정
                    className="absolute left-[20px] top-0 bottom-0 justify-center py-2"
                    activeOpacity={0.7}>
                    <Feather
                        name="chevron-left"
                        size={28} // 이미지처럼 조금 넉넉하고 터치하기 좋은 크기
                        className="text-text-default"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

export default Title;
