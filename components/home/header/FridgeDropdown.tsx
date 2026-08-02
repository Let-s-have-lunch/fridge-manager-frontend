import { Modal, Pressable, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Fridge } from "@/types/fridge";

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
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable className="flex-1 bg-black/20" onPress={onClose}>
                <View
                    className={twMerge(
                        "absolute",
                        "top-24",
                        "left-24",
                        "w-56",
                        "rounded-2xl",
                        "overflow-hidden",
                        "border",
                        "border-[#BACFCD]",
                        "bg-bg-paper",
                    )}>
                    {fridges.map(fridge => (
                        <Pressable
                            key={fridge.id}
                            onPress={() => onSelect(fridge.id)}
                            className={twMerge(
                                "px-4 py-3",
                                fridge.id === selectedFridgeId && "bg-primary-subtle",
                            )}>
                            <Text className="text-text-default">
                                {fridge.id === selectedFridgeId ? "✓ " : ""}
                                {fridge.name}
                            </Text>
                        </Pressable>
                    ))}

                    <View className="border-t border-divider" />

                    <Pressable className="px-4 py-3" onPress={onOpenSetting}>
                        <Text className="font-medium text-text-default">⚙️ 냉장고 설정</Text>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
}
