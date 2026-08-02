import { forwardRef, useMemo } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import fridgeApi from "@/api/user/fridgeApi";
import { Fridge } from "@/types/fridge";
import { useHomeStore } from "@/stores/home/productStore";
import { isAxiosError } from "axios";

interface DeleteFridgeSheetProps {
    fridge?: Fridge;
    onClose: () => void;
}

const DeleteFridgeSheet = forwardRef<BottomSheetModal, DeleteFridgeSheetProps>(
    ({ fridge, onClose }, ref) => {
        const snapPoints = useMemo(() => ["38%"], []);

        const fridges = useHomeStore(state => state.fridges);
        const setFridges = useHomeStore(state => state.setFridges);
        const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);

        const handleDelete = async () => {
            if (!fridge) return;

            if (fridges.length === 1) {
                Alert.alert("삭제할 수 없습니다.", "최소 1개의 냉장고는 있어야 합니다.");
                return;
            }

            try {
                await fridgeApi.deleteFridge(fridge.id);

                const fridgeList = await fridgeApi.getFridgeList();

                setFridges(fridgeList);
                setSelectedFridgeId(fridgeList[0]?.id ?? null);

                onClose();
            } catch (error) {
                if (isAxiosError(error)) {
                    Alert.alert(
                        "오류",
                        error.response?.data?.message ?? "삭제 중 오류가 발생했습니다.",
                    );
                    return;
                }

                Alert.alert("오류", "알 수 없는 오류가 발생했습니다.");
            }
        };

        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                handleComponent={() => null}
                enablePanDownToClose
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        pressBehavior="close"
                    />
                )}>
                <BottomSheetView className="flex-1 rounded-t-[32px] bg-bg-paper">
                    <View className="flex-1 px-6 pb-8">
                        <View className="items-center mb-6">
                            <View className="mt-2.5 h-1.5 w-14 rounded-full bg-divider" />
                        </View>

                        <Text className="text-center text-[24px] font-bold text-text-default">
                            냉장고 삭제
                        </Text>

                        <Text className="mt-6 text-center text-[16px] text-text-secondary">
                            "{fridge?.name}" 냉장고를 정말 삭제하시겠습니까?
                        </Text>

                        <View className="mt-6 flex-row gap-4">
                            <Pressable
                                onPress={onClose}
                                className="flex-1 h-14 items-center justify-center rounded-[18px] bg-bg-button">
                                <Text className="text-[18px] font-semibold text-text-default">취소</Text>
                            </Pressable>

                            <Pressable
                                onPress={handleDelete}
                                className="flex-1 h-14 items-center justify-center rounded-[18px] bg-error-point">
                                <Text className="text-[18px] font-semibold text-text-contrast">삭제</Text>
                            </Pressable>
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        );
    },
);

DeleteFridgeSheet.displayName = "DeleteFridgeSheet";

export default DeleteFridgeSheet;
