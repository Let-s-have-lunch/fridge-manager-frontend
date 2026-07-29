import { ShoppingItem } from "@/types/shoppingList";
import {
    ShoppingListFormInputType,
    shoppingListFormSchema,
} from "@/schemas/user/ShoppingListFormSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import shoppingListApi from "@/api/user/shoppingListApi";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    Pressable,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from "react-native";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";

interface Props {
    visible: boolean;
    onClose: () => void;
    targetDate: string;
    initialData: ShoppingItem | null;
    onRefresh: () => Promise<void>;
}

export default function ShoppingListFormModal({
    visible,
    onClose,
    targetDate,
    initialData,
    onRefresh,
}: Props) {
    const { width } = useWindowDimensions();
    const isMd = width >= 768;

    // 🟢 모달이 닫히는 도중 텍스트가 바뀌는 것을 방지하기 위한 상태 추가
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ShoppingListFormInputType>({
        resolver: zodResolver(shoppingListFormSchema),
        defaultValues: { memo: "" },
        mode: "onTouched",
    });

    useEffect(() => {
        // 🔄 visible이 true일 때(열릴 때)만 상태를 세팅하여, 닫히는 애니메이션 중에는 이전 텍스트 유지
        if (visible) {
            setIsEditMode(!!initialData);
            reset({
                memo: initialData?.memo || "",
            });
        }
    }, [visible, initialData, reset]);

    const panResponder = useRef(
        PanResponder.create({
            // 🟢 클릭 이벤트를 하위 컴포넌트(Pressable)로 통과시키기 위해 false로 변경
            onStartShouldSetPanResponder: () => false,
            // 🟢 사용자가 마우스나 손가락을 10px 이상 '움직였을 때만' 제스처 가로채기
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 10;
            },
            onPanResponderRelease: (_, gestureState) => {
                // 아래로 50픽셀 이상 스와이프 했으면 onClose() 호출
                if (gestureState.dy > 50) {
                    onClose();
                }
            },
        }),
    ).current;

    const onSubmit = async (data: ShoppingListFormInputType) => {
        const [year, month, day] = targetDate.split("-").map(Number);
        const finalDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        const payload = {
            memo: data.memo,
            date: finalDate.toISOString(),
        };

        try {
            if (isEditMode && initialData) {
                await shoppingListApi.updateShoppingItem(initialData.id, payload);
            } else {
                await shoppingListApi.createShoppingItem(payload);
            }
            await onRefresh();
            onClose();
        } catch (error) {
            console.log(error);

            const errorKeyword = isEditMode ? "수정" : "저장"; // 🔄 initialData 대신 isEditMode 사용
            if (Platform.OS === "web") {
                alert(`${errorKeyword} 중 문제가 발생했습니다.`);
            } else {
                Alert.alert("오류", `${errorKeyword} 중 문제가 발생했습니다.`);
            }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={isMd ? "fade" : "slide"}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 bg-black/50 justify-end md:justify-center md:items-center">
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View
                            className={
                                "bg-bg-default px-6 pt-4 pb-12 w-full min-h-[50%] rounded-t-[36px] md:max-w-[450px] md:rounded-[36px] md:min-h-0 md:pt-8"
                            }>
                            {!isMd && (
                                <View
                                    {...panResponder.panHandlers}
                                    className="w-full items-center pb-6 -mt-2">
                                    <Pressable
                                        onPress={onClose}
                                        className="w-full items-center py-2 cursor-pointer">
                                        <View className="w-12 h-1.5 rounded-full bg-gray-400" />
                                    </Pressable>
                                </View>
                            )}

                            <Title
                                title={isEditMode ? "일정 수정" : "일정 등록"}
                                className={"h-auto pb-6 mb-6 text-2xl"}
                            />

                            <Controller
                                control={control}
                                name="memo"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        label="내용"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.memo?.message}
                                        placeholder="할 일을 입력해주세요."
                                        selectTextOnFocus={isEditMode}
                                    />
                                )}
                            />

                            <View className="flex-row mt-6 gap-3">
                                <Button wrap={true} onPress={onClose} color={"success"}>
                                    취소
                                </Button>
                                <Button
                                    wrap={true}
                                    onPress={handleSubmit(onSubmit)}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? "처리중..." : isEditMode ? "수정" : "등록"}
                                </Button>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
