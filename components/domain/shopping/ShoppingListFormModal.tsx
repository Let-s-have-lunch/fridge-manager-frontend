import { ShoppingItem } from "@/types/shoppingList";
import {
    ShoppingListFormInputType,
    shoppingListFormSchema,
} from "@/schemas/user/ShoppingListFormSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import shoppingListApi from "@/api/user/shoppingListApi";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
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

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ShoppingListFormInputType>({
        resolver: zodResolver(shoppingListFormSchema),
        defaultValues: { memo: "" },
        mode: "onTouched"
    });

    useEffect(() => {
        if (visible) {
            reset({
                memo: initialData?.memo || "",
            });
        }
    }, [visible, reset, initialData]);

    const onSubmit = async (data: ShoppingListFormInputType) => {
        const [year, month, day] = targetDate.split("-").map(Number);
        const finalDate = new Date(year, month - 1, day, 0, 0, 0, 0);

        const payload = {
            memo: data.memo,
            date: finalDate.toISOString(),
        };

        try {
            if (initialData) {
                await shoppingListApi.updateShoppingItem(initialData.id, payload);
            } else {
                await shoppingListApi.createShoppingItem(payload);
            }
            await onRefresh();
            onClose();
        } catch (error) {
            console.log(error);

            const errorKeyword = initialData ? "수정" : "저장";
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
                                "bg-bg-default px-6 pt-8 pb-12 w-full min-h-[50%] rounded-t-[36px] md:max-w-[450px] md:rounded-[36px] md:min-h-0"
                            }>
                            <Title
                                title={initialData ? "일정 수정" : "일정 등록"}
                                className={"h-auto pb-6 mb-6"}
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
                                        selectTextOnFocus={!!initialData}
                                    />
                                )}
                            />

                            <View className="flex-row mt-6 gap-3">
                                <Button wrap={true} onPress={onClose} color={"secondary"}>
                                    취소
                                </Button>
                                <Button
                                    wrap={true}
                                    onPress={handleSubmit(onSubmit)}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? "처리중..." : initialData ? "수정" : "등록"}
                                </Button>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
