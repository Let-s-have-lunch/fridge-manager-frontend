import { ShoppingItem } from "@/types/shoppingList";
import {
    ShoppingListFormInputType,
    shoppingListFormSchema,
} from "@/schemas/user/ShoppingListFormSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import shoppingListApi from "@/api/user/shoppingListApi";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    TouchableWithoutFeedback,
    useWindowDimensions,
    View,
} from "react-native";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import { useSwipeDown } from "@/hooks/useSwipeDown";

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

    const swipeDownHandlers = useSwipeDown(onClose);

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
        if (visible) {
            setIsEditMode(!!initialData);
            reset({
                memo: initialData?.memo || "",
            });
        }
    }, [visible, initialData, reset]);

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

            const errorKeyword = isEditMode ? "수정" : "저장";
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
                    className="flex-1 justify-end bg-black/50 md:justify-center md:items-center">
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View className="w-full min-h-[50%] px-6 pt-4 pb-12 bg-bg-default rounded-t-[36px] md:max-w-[450px] md:min-h-0 md:pt-8 md:rounded-[36px]">
                            {!isMd && (
                                <View
                                    {...swipeDownHandlers}
                                    className="w-full items-center pb-6 -mt-2">
                                    <Pressable
                                        onPress={onClose}
                                        className="w-full items-center cursor-pointer py-2">
                                        <View className="w-12 h-1.5 bg-gray-400 rounded-full" />
                                    </Pressable>
                                </View>
                            )}

                            <Title
                                title={isEditMode ? "일정 수정" : "일정 등록"}
                                className="h-auto pb-6 mb-6"
                                textClassName={"text-2xl"}
                            />

                            <Controller
                                control={control}
                                name="memo"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        label="제품명"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.memo?.message}
                                        placeholder="장 봐야할 제품을 입력해주세요."
                                        selectTextOnFocus={isEditMode}
                                    />
                                )}
                            />

                            <View className="flex-row gap-3 mt-6">
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