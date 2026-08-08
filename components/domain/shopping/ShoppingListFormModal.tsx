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
    Modal,
    Platform,
    Pressable,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import InputGroup from "@/components/common/input/InputGroup";
import { useThemeStore } from "@/stores/theme/useThemeStore";

interface Props {
    visible: boolean;
    onClose: () => void;
    targetDate: string;
    initialData: ShoppingItem | null;
    onRefresh: () => Promise<any>;
}

export default function ShoppingListFormModal({
    visible,
    onClose,
    targetDate,
    initialData,
    onRefresh,
}: Props) {
    const [isEditMode, setIsEditMode] = useState(false);

    const theme = useThemeStore(state => state.theme);
    const isDarkMode = theme === "dark";

    const bgColor = isDarkMode ? "#3A3532" : "#FFFFFF";

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ShoppingListFormInputType>({
        resolver: zodResolver(shoppingListFormSchema),
        defaultValues: {
            memo: "",
        },
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

    const handleClose = () => {
        reset({
            memo: "",
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}>
            {/* 바깥 영역 */}
            <TouchableWithoutFeedback onPress={handleClose}>
                <View className="flex-1 items-center justify-center bg-black/50">
                    {/* 모달 카드 */}
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View
                            style={{
                                backgroundColor: bgColor,
                            }}
                            className="w-[calc(100%-48px)] max-w-[400px] rounded-[32px] px-6 pt-8 pb-8 shadow-lg">
                            {/* 제목 */}
                            <Text className="mb-8 text-center text-[23px] font-bold text-text-default">
                                {isEditMode ? "일정 수정" : "일정 등록"}
                            </Text>

                            {/* 라벨 */}
                            <Text className="mb-3 text-[16px] font-semibold text-text-default">
                                제품명
                            </Text>

                            {/* 입력 */}
                            <Controller
                                control={control}
                                name="memo"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        errorMessage={errors.memo?.message}
                                        placeholder="장 봐야할 제품을 입력해주세요."
                                        selectTextOnFocus={isEditMode}
                                    />
                                )}
                            />

                            {/* 버튼 */}
                            <View className="mt-6 flex-row gap-4">
                                {/* 취소 */}
                                <Pressable
                                    onPress={handleClose}
                                    disabled={isSubmitting}
                                    className="h-14 flex-1 items-center justify-center rounded-[18px] bg-bg-button">
                                    <Text className="text-[18px] font-semibold text-text-default">
                                        취소
                                    </Text>
                                </Pressable>

                                {/* 등록 / 수정 */}
                                <Pressable
                                    onPress={handleSubmit(onSubmit)}
                                    disabled={isSubmitting}
                                    className={`h-14 flex-1 items-center justify-center rounded-[18px] bg-primary-main ${
                                        isSubmitting ? "opacity-50" : ""
                                    }`}>
                                    <Text className="text-[18px] font-semibold text-text-contrast">
                                        {isSubmitting ? "처리중..." : isEditMode ? "수정" : "등록"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
