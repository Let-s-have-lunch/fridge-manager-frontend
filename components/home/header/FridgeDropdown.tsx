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
import { Ionicons } from "@expo/vector-icons";

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
    const isMd = width >= 768;

    const theme = useThemeStore(state => state.theme);
    const isDarkMode = theme === "dark";
    const bgColor = isDarkMode ? "#3A3532" : "#FFFFFF";

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable
                className={twMerge(
                    "flex-1 items-center justify-start",
                    isMd ? "pt-[72px]" : "pt-[105px]",
                )}
                onPress={onClose}>
                <View
                    className={twMerge(
                        "w-full items-start px-5",
                        isMd ? "max-w-6xl" : "max-w-full",
                    )}>
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View
                            style={{
                                backgroundColor: bgColor,

                                // 은은한 그림자
                                shadowColor: "#000",
                                shadowOpacity: 0.08,
                                shadowRadius: 10,
                                shadowOffset: {
                                    width: 0,
                                    height: 4,
                                },
                                elevation: 4,
                            }}
                            className={twMerge(
                                "mt-2 w-56 overflow-hidden rounded-[24px]",
                                isMd ? "ml-[95px]" : "ml-[75px]",
                            )}>
                            {fridges.map(fridge => (
                                <Pressable
                                    key={fridge.id}
                                    onPress={() => onSelect(fridge.id)}
                                    className="flex-row items-center justify-between px-4 py-3 active:bg-bg-subtle">
                                    <TextComponent
                                        className={twMerge(
                                            "text-[15px] font-semibold",
                                            fridge.id === selectedFridgeId
                                                ? "text-primary-main"
                                                : "text-text-subtle",
                                        )}>
                                        {fridge.name}
                                    </TextComponent>

                                    {fridge.id === selectedFridgeId && (
                                        <TextComponent className="font-bold text-primary-point">
                                            ✓
                                        </TextComponent>
                                    )}
                                </Pressable>
                            ))}

                            <View className="border-t border-divider" />

                            {/* 냉장고 설정 버튼 */}
                            <Pressable
                                className="flex-row items-center justify-between px-4 py-3 active:bg-bg-subtle"
                                onPress={onOpenSetting}>
                                <TextComponent className="text-[15px] font-semibold text-text-default">
                                    냉장고 설정
                                </TextComponent>

                                <Ionicons name="chevron-forward" size={18} color="#999" />
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Pressable>
        </Modal>
    );
}
