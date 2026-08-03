import { forwardRef, useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { useThemeStore } from "@/stores/theme/useThemeStore";

import MenuItem from "@/components/home/header/MenuItem";

interface FridgeSettingSheetProps {
    onClose: () => void;
    onAddFridge: () => void;
    onEditFridge: () => void;
    onDeleteFridge: () => void;
}

const FridgeSettingSheet = forwardRef<BottomSheetModal, FridgeSettingSheetProps>(
    ({ onClose, onAddFridge, onEditFridge, onDeleteFridge }, ref) => {
        const snapPoints = useMemo(() => ["70%"], []);
        const theme = useThemeStore(state => state.theme);
        const isDarkMode = theme === "dark";
        console.log("theme:", theme);
        return (
            <BottomSheetModal
                ref={ref}
                snapPoints={snapPoints}
                handleComponent={() => null}
                enablePanDownToClose
                backgroundStyle={{
                    backgroundColor: isDarkMode ? "#3A3532" : "#FFFFFF",
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
                <BottomSheetView className="flex-1 rounded-t-[32px] bg-bg-paper px-6 pt-4 pb-8">
                    {/* Handle */}
                    <View className="mt-3 mb-5 items-center">
                        <View className="h-1.5 w-14 rounded-full bg-divider" />
                    </View>

                    <Text className="mt-1 mb-5 text-center text-[23px] font-bold text-text-default">
                        냉장고 설정
                    </Text>

                    <View
                        className="mx-5 mt-2 overflow-hidden rounded-[28px] border border-divider bg-bg-paper"
                        style={{
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
                        onPress={onClose}>
                        <Text className="text-lg font-semibold text-text-default">닫기</Text>
                    </Pressable>
                </BottomSheetView>
            </BottomSheetModal>
        );
    },
);

FridgeSettingSheet.displayName = "FridgeSettingSheet";

export default FridgeSettingSheet;
