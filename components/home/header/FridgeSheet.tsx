import { forwardRef, useEffect, useMemo, useState, useRef, useImperativeHandle } from "react";
import {
    Alert,
    Pressable,
    Text,
    TextInput,
    View,
    Modal,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import fridgeApi from "@/api/user/fridgeApi";
import { useHomeStore } from "@/stores/home/productStore";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFridgeSchema, FridgeInputType } from "@/schemas/user/createFridgeSchema";
import { isAxiosError } from "axios";
import { Fridge } from "@/types/fridge";
import { useThemeStore } from "@/stores/theme/useThemeStore";

interface FridgeSheetProps {
    mode: "create" | "edit";
    fridge?: Fridge;
    onClose: () => void;
}

const FridgeSheet = forwardRef<BottomSheetModal, FridgeSheetProps>(
    ({ mode, fridge, onClose }, ref) => {
        const { width } = useWindowDimensions();
        const isMd = width >= 768;

        const [isModalVisible, setIsModalVisible] = useState(false);
        const bottomSheetRef = useRef<BottomSheetModal>(null);

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

        const snapPoints = useMemo(() => ["55%"], []);

        const {
            control,
            handleSubmit,
            watch,
            formState: { errors },
            reset,
        } = useForm<FridgeInputType>({
            resolver: zodResolver(createFridgeSchema),
            defaultValues: {
                name: "",
            },
        });

        const theme = useThemeStore(state => state.theme);
        const isDarkMode = theme === "dark";
        const bgColor = isDarkMode ? "#3A3532" : "#FFFFFF";

        useEffect(() => {
            if (mode === "edit" && fridge) {
                reset({ name: fridge.name });
            } else {
                reset({ name: "" });
            }
        }, [mode, fridge, reset]);

        const name = watch("name");

        const setFridges = useHomeStore(state => state.setFridges);
        const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);

        const handleClose = () => {
            setIsModalVisible(false);
            bottomSheetRef.current?.dismiss();
            onClose();
        };

        const onSubmit = async (data: FridgeInputType) => {
            try {
                let selectedId: number;

                if (mode === "create") {
                    const newFridge = await fridgeApi.createFridge(data);
                    selectedId = newFridge.id;
                } else {
                    await fridgeApi.updateFridge(fridge!.id, data);
                    selectedId = fridge!.id;
                }

                const fridgeList = await fridgeApi.getFridgeList();

                setFridges(fridgeList);
                setSelectedFridgeId(selectedId);

                reset();
                handleClose();
            } catch (error) {
                if (isAxiosError(error)) {
                    Alert.alert(
                        "알림",
                        error.response?.data?.message ?? "냉장고 등록 중 오류가 발생했습니다.",
                    );
                    return;
                }

                Alert.alert("알림", "알 수 없는 오류가 발생했습니다.");
            }
        };
        const disabled = !(name ?? "").trim();

        // 💡 [수정 1] 컴포넌트 선언 대신 변수 형태로 보관하여 포커스 해제 현상 방지
        const formContent = (
            <>
                {/* Handle - 모바일에서만 노출 */}
                {!isMd && (
                    <View className="items-center mb-6">
                        <View className="mt-2.5 h-1.5 w-14 rounded-full bg-divider" />
                    </View>
                )}

                {/* 제목 */}
                <Text className="mb-8 text-center text-[23px] font-bold text-text-default">
                    {mode === "create" ? "냉장고 추가" : "냉장고 수정"}
                </Text>

                {/* 라벨 */}
                <Text className="mb-3 text-[16px] font-semibold text-text-default">
                    냉장고 이름
                </Text>

                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <TextInput
                            value={field.value}
                            // 💡 [수정 2] maxLength 대신 slice로 10자 제한 처리
                            onChangeText={text => field.onChange(text.slice(0, 10))}
                            placeholder="냉장고 이름을 입력해주세요"
                            placeholderTextColor="#B6B6B6"
                            className="h-14 rounded-[18px] border border-divider px-5 text-[16px] text-text-default"
                        />
                    )}
                />
                {errors.name && (
                    <Text className="mt-2 text-sm text-error-point">{errors.name.message}</Text>
                )}

                {/* 글자수 */}
                <Text className="mt-2 text-right text-text-secondary">
                    {(name ?? "").length} / 10
                </Text>

                <View className="mt-2 flex-row gap-4">
                    <Pressable
                        onPress={handleClose}
                        className="flex-1 h-14 items-center justify-center rounded-[18px] bg-bg-button">
                        <Text className="text-[18px] font-semibold text-text-default">취소</Text>
                    </Pressable>

                    <Pressable
                        disabled={disabled}
                        className="flex-1 h-14 items-center justify-center rounded-[18px] bg-primary-main"
                        onPress={handleSubmit(onSubmit)}>
                        <Text className="text-[18px] font-semibold text-text-contrast">저장</Text>
                    </Pressable>
                </View>
            </>
        );

        if (isMd) {
            return (
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => {
                        reset();
                        handleClose();
                    }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            reset();
                            handleClose();
                        }}>
                        <View className="flex-1 items-center justify-center bg-black/50">
                            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                                <View
                                    style={{ backgroundColor: bgColor }}
                                    className="w-full max-w-[400px] rounded-[32px] px-6 pt-8 pb-8 shadow-lg">
                                    {/* 💡 [수정 1-1] {formContent} 바인딩 */}
                                    {formContent}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            );
        }

        return (
            <BottomSheetModal
                ref={bottomSheetRef}
                onDismiss={() => {
                    reset();
                    setIsModalVisible(false);
                }}
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
                    <BottomSheetView className="flex-1 bg-bg-paper rounded-t-[32px]">
                        <View className="flex-1 px-6 pb-8">
                            {/* 💡 [수정 1-2] {formContent} 바인딩 */}
                            {formContent}
                        </View>
                    </BottomSheetView>
                </View>
            </BottomSheetModal>
        );
    },
);

FridgeSheet.displayName = "FridgeSheet";

export default FridgeSheet;
