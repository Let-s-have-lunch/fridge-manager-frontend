import {
    Modal,
    Pressable,
    View,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { Fridge } from "@/types/fridge";
import TextComponent from "@/components/common/text/TextComponent";
import { useThemeStore } from "@/stores/theme/useThemeStore";

interface FridgeDropdownProps {
    visible: boolean;
    fridges: Fridge[];
    selectedFridgeId?: number | null;
    onClose: () => void;
    onSelect: (id: number) => void;
    onOpenSetting: () => void;
}

export default function FridgeDropdown({
    visible,
    fridges,
    selectedFridgeId,
    onClose,
    onSelect,
    onOpenSetting,
}: FridgeDropdownProps) {
    const { width } = useWindowDimensions();
    const isMd = width >= 768; // 화면 크기 감지

    const theme = useThemeStore(state => state.theme);
    const isDarkMode = theme === "dark";
    const bgColor = isDarkMode ? "#3A3532" : "#FFFFFF"; // 글로벌 색상 연동

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            {/* 1. Modal 전체 배경 */}
            <Pressable
                className={twMerge(
                    "flex-1 items-center justify-start bg-black/20",
                    // 💡 [세로 위치] PC는 헤더 높이만큼, 모바일은 모바일 헤더 높이에 맞게 띄웁니다.
                    isMd ? "pt-[72px]" : "pt-[105px]",
                )}
                onPress={onClose}>
                {/* 2. 가로 뼈대 */}
                <View
                    className={twMerge(
                        "w-full px-5 items-start",
                        isMd ? "max-w-6xl" : "max-w-full", // 모바일은 전체 너비 사용
                    )}>
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View
                            style={{
                                backgroundColor: bgColor,
                                shadowColor: "#000",
                                shadowOpacity: 0.1,
                                shadowRadius: 15,
                                shadowOffset: { width: 0, height: 4 },
                                elevation: 5,
                            }}
                            className={twMerge(
                                "w-56",
                                "rounded-2xl",
                                "overflow-hidden",
                                "border",
                                "border-[#BACFCD]",
                                "mt-2",
                                // 💡 [가로 위치] PC는 프로필 옆으로 길게, 모바일은 여백에 맞춰 짧게 밀어줍니다.
                                isMd ? "ml-[95px]" : "ml-[75px]",
                            )}>
                            {/* 냉장고 목록 */}
                            {fridges.map(fridge => (
                                <Pressable
                                    key={fridge.id}
                                    onPress={() => onSelect(fridge.id)}
                                    className={twMerge(
                                        "flex-row items-center justify-between px-4 py-3 active:bg-bg-subtle",
                                        fridge.id === selectedFridgeId && "bg-button-subtle",
                                    )}>
                                    <TextComponent
                                        className={twMerge(
                                            "text-[15px]",
                                            fridge.id === selectedFridgeId
                                                ? "font-bold text-text-default"
                                                : "text-text-secondary",
                                        )}>
                                        {fridge.name}
                                    </TextComponent>

                                    {fridge.id === selectedFridgeId && (
                                        <TextComponent className="text-primary-point font-bold">
                                            ✓
                                        </TextComponent>
                                    )}
                                </Pressable>
                            ))}

                            <View className="border-t border-divider" />

                            {/* 냉장고 설정 버튼 */}
                            <Pressable
                                className="px-4 py-3 active:bg-bg-subtle"
                                onPress={onOpenSetting}>
                                <TextComponent className="text-[15px] font-bold text-text-default">
                                    냉장고 설정
                                </TextComponent>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Pressable>
        </Modal>
    );
}
