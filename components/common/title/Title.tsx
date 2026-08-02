import { ReactNode } from "react";
import { View, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";

interface Props {
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    description?: string;
    children?: ReactNode;
    className?: string;
    textClassName?: string;
    forceCenter?: boolean;
}

function Title({
    title,
    showBackButton = false,
    onBackPress,
    description,
    children,
    className,
    textClassName,
    forceCenter = false,
}: Props) {
    const isCentered = showBackButton || forceCenter;

    return (
        // 1. 최상위 View를 1번 코드처럼 flex-row items-center로 묶어 세로 정렬을 완벽하게 맞춤
        <View
            className={twMerge(
                "w-full h-14 flex-row items-center justify-between px-[20px] bg-transparent border-b border-divider relative",
                className,
            )}>
            {/* 2. 좌측 영역 (뒤로가기 버튼 + [좌측 정렬일 경우의 타이틀]) */}
            <View className="flex-row items-center flex-1 gap-2">
                {showBackButton && (
                    <TouchableOpacity
                        onPress={onBackPress}
                        className="py-2 justify-center"
                        activeOpacity={0.7}>
                        <Feather name="chevron-left" size={28} className="text-text-default" />
                    </TouchableOpacity>
                )}

                {/* 중앙 정렬이 아닐 때만 좌측에 타이틀 렌더링 (flex-1로 말줄임 자동 적용) */}
                {!isCentered && (
                    <View className="flex-1 justify-center">
                        <TextComponent
                            className={twMerge(
                                "text-text-default font-bold text-[18px]",
                                textClassName,
                            )}
                            numberOfLines={1}>
                            {title}
                        </TextComponent>
                        {description && (
                            <TextComponent
                                className="text-sm text-text-secondary mt-0.5"
                                numberOfLines={1}>
                                {description}
                            </TextComponent>
                        )}
                    </View>
                )}
            </View>

            {/* 3. 우측 영역 (Children) - flex-row로 감싸서 세로 정렬 유지 */}
            <View className="flex-row items-center shrink-0 pl-4 z-10">{children}</View>

            {/* 4. 중앙 정렬 타이틀 (isCentered가 true일 때만 화면 정중앙에 띄움) */}
            {isCentered && (
                <View
                    // left, right를 동일하게 주어 무조건 화면 정중앙에 오도록 강제 (버튼들과 안 겹치게 여백 60px 확보)
                    className="absolute left-[60px] right-[60px] top-0 bottom-0 justify-center items-center pointer-events-none">
                    <TextComponent
                        className={twMerge(
                            "text-text-default font-bold text-[18px] text-center",
                            textClassName,
                        )}
                        numberOfLines={1}>
                        {title}
                    </TextComponent>
                    {description && (
                        <TextComponent
                            className="text-sm text-text-secondary mt-0.5 text-center"
                            numberOfLines={1}>
                            {description}
                        </TextComponent>
                    )}
                </View>
            )}
        </View>
    );
}

export default Title;
