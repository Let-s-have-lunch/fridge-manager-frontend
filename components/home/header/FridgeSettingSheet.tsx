import { forwardRef, useMemo, useRef, useState, useImperativeHandle } from "react";
import {
    Pressable,
    Text,
    View,
    Modal,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { twMerge } from "tailwind-merge";

import MenuItem from "@/components/home/header/MenuItem";

interface FridgeSettingSheetProps {
    onClose: () => void;
    onAddFridge: () => void;
    onEditFridge: () => void;
    onDeleteFridge: () => void;
}

const FridgeSettingSheet = forwardRef<BottomSheetModal, FridgeSettingSheetProps>(
    ({ onClose, onAddFridge, onEditFridge, onDeleteFridge }, ref) => {
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
            } as unknown as BottomSheetModal; // 타입 에러 방지
        }, [isMd]);

        // 공통 닫기 핸들러
        const handleClose = () => {
            setIsModalVisible(false);
            bottomSheetRef.current?.dismiss();
            onClose();
        };

        const snapPoints = useMemo(() => ["70%"], []);
        const theme = useThemeStore(state => state.theme);
        const isDarkMode = theme === "dark";
        const bgColor = isDarkMode ? "#3A3532" : "#FFFFFF";

        // 3. 내부 컨텐츠 컴포넌트 분리 (중복 코드 방지)
        const MenuContent = () => (
            <>
                <Text
                    className={twMerge(
                        "text-center text-[23px] font-bold text-text-default",
                        isMd ? "mb-6 mt-2" : "mt-1 mb-5",
                    )}>
                    냉장고 설정
                </Text>

                <View
                    className="mx-5 overflow-hidden rounded-[28px] border border-divider"
                    style={{
                        backgroundColor: bgColor,
                        shadowColor: "#000",
                        shadowOpacity: 0.04,
                        shadowRadius: 12,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 3,
                    }}>
                    <MenuItem
                        icon="add"
                        color="#8AA9B9"
                        title="냉장고 추가"
                        subTitle="새로운 냉장고를 추가해요"
                        onPress={onAddFridge}
                    />
                    <MenuItem
                        icon="create-outline"
                        color="#8AA9B9"
                        title="냉장고 수정"
                        subTitle="냉장고 이름을 수정해요"
                        onPress={onEditFridge}
                    />
                    <MenuItem
                        icon="trash-outline"
                        color="#EB7868"
                        title="냉장고 삭제"
                        subTitle="냉장고를 삭제해요"
                        onPress={onDeleteFridge}
                        isLast
                    />
                </View>

                <Pressable
                    className="mx-5 mt-8 mb-8 h-14 items-center justify-center rounded-[22px] bg-button-subtle"
                    onPress={handleClose}>
                    <Text className="text-lg font-semibold text-text-default">닫기</Text>
                </Pressable>
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
                        <View className="flex-1 items-center justify-center">
                            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                                <View
                                    style={{ backgroundColor: bgColor }}
                                    className="w-full max-w-[400px] rounded-[32px] px-2 pt-6 pb-2">
                                    <MenuContent />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        }

        // 모바일 환경: 기존 팀원이 작성한 BottomSheet 렌더링
        return (
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                handleComponent={() => null}
                enablePanDownToClose
                onDismiss={onClose}
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
                    <BottomSheetView className="flex-1 rounded-t-[32px] bg-bg-paper px-1 pt-4 pb-0">
                        <View className="mt-3 mb-5 items-center">
                            <View className="h-1.5 w-14 rounded-full bg-divider" />
                        </View>
                        <MenuContent />
                    </BottomSheetView>
                </View>
            </BottomSheetModal>
        );
    },
);

FridgeSettingSheet.displayName = "FridgeSettingSheet";

export default FridgeSettingSheet;
