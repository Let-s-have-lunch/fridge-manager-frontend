import { forwardRef, useMemo, useState, useRef, useImperativeHandle } from "react";
import {
    Alert,
    Pressable,
    Text,
    View,
    Modal,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import fridgeApi from "@/api/user/fridgeApi";
import { Fridge } from "@/types/fridge";
import { useHomeStore } from "@/stores/home/productStore";
import { isAxiosError } from "axios";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import Button from "@/components/common/button/Button";

interface DeleteFridgeSheetProps {
    fridge?: Fridge;
    onClose: () => void;
}

const DeleteFridgeSheet = forwardRef<BottomSheetModal, DeleteFridgeSheetProps>(
    ({ fridge, onClose }, ref) => {
        const { width } = useWindowDimensions();
        const isMd = width >= 768;

        // 1. 상태 및 Ref 관리
        const [isModalVisible, setIsModalVisible] = useState(false);
        const bottomSheetRef = useRef<BottomSheetModal>(null);

        // 2. 부모의 ref.current.present() 호출 가로채기
        useImperativeHandle(ref, () => {
            return {
                present: () => {
                    if (isMd) {
                        setIsModalVisible(true);
                    } else {
                        bottomSheetRef.current?.present();
                    }
                },
                dismiss: () => {
                    setIsModalVisible(false);
                    bottomSheetRef.current?.dismiss();
                },
                close: () => {
                    setIsModalVisible(false);
                    bottomSheetRef.current?.close();
                },
            } as unknown as BottomSheetModal;
        }, [isMd]);

        const snapPoints = useMemo(() => ["38%"], []);

        const fridges = useHomeStore(state => state.fridges);
        const setFridges = useHomeStore(state => state.setFridges);
        const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);

        const theme = useThemeStore(state => state.theme);
        const isDarkMode = theme === "dark";
        const bgColor = isDarkMode ? "#3A3532" : "#FFFFFF"; // --bg-paper

        // 공통 닫기 핸들러
        const handleClose = () => {
            setIsModalVisible(false);
            bottomSheetRef.current?.dismiss();
            onClose();
        };

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

                handleClose(); // 👈 기존 onClose 대신 공통 닫기 함수 호출
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

        // 3. 내용물 분리 (디자인 변경 없이 그대로 분리)
        const DeleteContent = () => (
            <>
                {/* Handle - 모바일에서만 노출 */}
                {!isMd && (
                    <View className="items-center mb-6">
                        <View className="mt-2.5 h-1.5 w-14 rounded-full bg-divider" />
                    </View>
                )}

                <Text className="text-center text-[23px] font-bold text-text-default">
                    냉장고 삭제
                </Text>

                <Text className="mt-5 text-center text-[14px] text-text-secondary">
                    "{fridge?.name}" 냉장고를 정말 삭제하시겠습니까?
                </Text>

                <View className="mt-6 flex-row gap-4">
                    <Button
                        variant="outlined"
                        onPress={handleClose}
                        className="flex-1 h-14 rounded-[18px] bg-bg-button"
                        textClassName="text-[18px] font-semibold text-text-default">
                        취소
                    </Button>

                    <Button
                        variant="contained-square"
                        onPress={handleDelete}
                        className="flex-1 h-14 rounded-[18px] bg-error-point"
                        textClassName="text-[18px] font-semibold text-text-contrast">
                        삭제
                    </Button>
                </View>
            </>
        );

        // 4. 화면 크기에 따른 조건부 렌더링
        if (isMd) {
            // 태블릿/PC 환경: 중앙 모달 렌더링
            return (
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleClose}>
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <View className="flex-1 items-center justify-center bg-black/50">
                            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                                <View
                                    style={{ backgroundColor: bgColor }}
                                    className="w-full max-w-[400px] rounded-[32px] px-6 pt-8 pb-8 shadow-lg">
                                    <DeleteContent />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        }

        // 모바일 환경: 팀원이 짠 기존 바텀 시트 렌더링
        return (
            <BottomSheetModal
                ref={bottomSheetRef}
                onDismiss={() => setIsModalVisible(false)}
                snapPoints={snapPoints}
                handleComponent={() => null}
                enablePanDownToClose
                backgroundStyle={{
                    backgroundColor: bgColor,
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                }}
                backdropComponent={props => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        pressBehavior="close"
                        opacity={0.3}
                    />
                )}>
                <View className={"flex-1"}>
                    <BottomSheetView className="flex-1 rounded-t-[32px] bg-bg-paper">
                        <View className="flex-1 px-6 pb-8">
                            <DeleteContent />
                        </View>
                    </BottomSheetView>
                </View>
            </BottomSheetModal>
        );
    },
);

DeleteFridgeSheet.displayName = "DeleteFridgeSheet";

export default DeleteFridgeSheet;
