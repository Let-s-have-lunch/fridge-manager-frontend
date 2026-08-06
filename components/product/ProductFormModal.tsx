import { useEffect } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import { productSchema, ProductInputType } from "@/schemas/user/productSchema";
import { useHomeStore } from "@/stores/home/productStore";
import { ProductDetailItemType } from "@/types/product";
import productApi from "@/api/user/productApi";

interface Props {
    visible: boolean;
    onClose: () => void;
    initialData: ProductDetailItemType | null; // 수정 시 전달될 기존 식재료 데이터
    onRefresh: () => Promise<void>; // 저장/수정 후 목록 새로고침 함수
}

export default function ProductFormModal({ visible, onClose, initialData, onRefresh }: Props) {
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);

    const {
        control,
        reset,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ProductInputType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            memo: "",
            categoryId: "" as any, // 렌더링 시 빈칸 유지를 위해 빈 문자열 사용
            storageType: "REFRIGERATED",
            quantity: "" as any, // 빈 문자열
            unit: "EA",
            price: "" as any, // 빈 문자열
            expirationDate: "",
            status: "STORED",
        },
        mode: "onTouched",
    });

    const isEditMode = !!initialData;

    useEffect(() => {
        if (visible) {
            if (initialData) {
                // ✅ 수정 모드: 기존 데이터 폼에 세팅
                const formattedDate = initialData.expirationDate.substring(0, 10).replace(/-/g, "");

                reset({
                    name: initialData.name,
                    memo: initialData.memo || "",
                    categoryId: initialData.categoryId,
                    storageType: initialData.storageType,
                    quantity: initialData.quantity,
                    unit: initialData.unit,
                    price: initialData.price ?? ("" as any),
                    expirationDate: formattedDate,
                    status: initialData.status,
                });
            } else {
                reset({
                    name: "",
                    memo: "",
                    categoryId: "" as any,
                    storageType: "REFRIGERATED",
                    quantity: "" as any,
                    unit: "EA",
                    price: "" as any,
                    expirationDate: "",
                    status: "STORED",
                });
            }
        }
    }, [visible, initialData, reset]);

    const onSubmit = async (data: ProductInputType) => {
        try {
            const { expirationDate, ...prevInput } = data;

            let formattedExpirationDate = expirationDate;

            if (expirationDate && expirationDate.length === 8) {
                const year = expirationDate.slice(0, 4);
                const month = expirationDate.slice(4, 6);
                const day = expirationDate.slice(6, 8);

                formattedExpirationDate = `${year}-${month}-${day}T00:00:00Z`;
            }

            const payload = {
                ...prevInput,
                expirationDate: formattedExpirationDate,
            };

            if (isEditMode && initialData) {
                await productApi.updateProduct(initialData.id, payload as any);
            } else {
                if (!selectedFridgeId) {
                    Alert.alert("오류", "선택된 냉장고가 없습니다.");
                    return;
                }
                await productApi.createProduct(selectedFridgeId, payload as any);
            }

            await onRefresh();
            onClose();
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "문제가 발생했습니다.";
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType={"fade"}
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 justify-end bg-black/50 md:justify-center md:items-center">
                    <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                        <View className="w-full max-h-[85%] px-6 pt-4 pb-12 bg-bg-default rounded-t-[36px] md:max-w-[480px] md:max-h-[90%] md:pt-8 md:rounded-[36px]">
                            <Title
                                title={isEditMode ? "식재료 수정" : "식재료 추가"}
                                className="h-auto pb-4 mb-4"
                                textClassName={"text-2xl"}
                            />

                            {/* 내용이 길어질 수 있으므로 ScrollView 적용 */}
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 20 }}>
                                {/* 상품명 */}
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="상품명"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            errorMessage={errors.name?.message}
                                            placeholder="예: 신선한 계란"
                                        />
                                    )}
                                />

                                {/* 수량 */}
                                <Controller
                                    control={control}
                                    name="quantity"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="수량"
                                            placeholder="숫자만 입력"
                                            keyboardType="numeric"
                                            onBlur={onBlur}
                                            onChangeText={text => {
                                                const num = parseInt(
                                                    text.replace(/[^0-9]/g, ""),
                                                    10,
                                                );
                                                onChange(isNaN(num) ? undefined : num);
                                            }}
                                            value={value?.toString()}
                                            errorMessage={errors.quantity?.message}
                                        />
                                    )}
                                />

                                {/* 가격 (선택) */}
                                <Controller
                                    control={control}
                                    name="price"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="가격 (선택)"
                                            placeholder="가격을 입력해주세요"
                                            keyboardType="numeric"
                                            onBlur={onBlur}
                                            onChangeText={text => {
                                                const num = parseInt(
                                                    text.replace(/[^0-9]/g, ""),
                                                    10,
                                                );
                                                onChange(isNaN(num) ? undefined : num);
                                            }}
                                            value={value?.toString()}
                                            errorMessage={errors.price?.message}
                                        />
                                    )}
                                />

                                {/* 단위 */}
                                <Controller
                                    control={control}
                                    name="unit"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="단위 (EA, G, KG, ML, L)"
                                            placeholder="EA"
                                            autoCapitalize="characters"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            errorMessage={errors.unit?.message}
                                        />
                                    )}
                                />

                                {/* 보관 방법 */}
                                <Controller
                                    control={control}
                                    name="storageType"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="보관 방법 (REFRIGERATED, FROZEN, ROOM_TEMP)"
                                            placeholder="REFRIGERATED"
                                            autoCapitalize="characters"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            errorMessage={errors.storageType?.message}
                                        />
                                    )}
                                />

                                {/* 유통기한 (자동 하이픈 마스킹) */}
                                <Controller
                                    control={control}
                                    name="expirationDate"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="유통기한"
                                            placeholder="YYYY-MM-DD"
                                            keyboardType="number-pad"
                                            maxLength={10}
                                            onBlur={onBlur}
                                            onChangeText={text => {
                                                let cleaned = text.replace(/[^0-9]/g, "");
                                                if (cleaned.length > 4 && cleaned.length <= 6) {
                                                    cleaned = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
                                                } else if (cleaned.length > 6) {
                                                    cleaned = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
                                                }
                                                onChange(cleaned);
                                            }}
                                            value={value}
                                            errorMessage={errors.expirationDate?.message}
                                        />
                                    )}
                                />

                                {/* 카테고리 ID */}
                                <Controller
                                    control={control}
                                    name="categoryId"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="카테고리 ID"
                                            placeholder="숫자 입력"
                                            keyboardType="number-pad"
                                            onBlur={onBlur}
                                            onChangeText={text => {
                                                const num = parseInt(
                                                    text.replace(/[^0-9]/g, ""),
                                                    10,
                                                );
                                                onChange(isNaN(num) ? undefined : num);
                                            }}
                                            value={value?.toString()}
                                            errorMessage={errors.categoryId?.message}
                                        />
                                    )}
                                />

                                {/* 메모 */}
                                <Controller
                                    control={control}
                                    name="memo"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="메모 (선택)"
                                            placeholder="간단한 메모를 입력하세요."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            errorMessage={errors.memo?.message}
                                        />
                                    )}
                                />

                                {/* Root 에러 메시지 */}
                                {errors.root?.message && (
                                    <ErrorMessage className="text-center mt-2 mb-2">
                                        {errors.root?.message}
                                    </ErrorMessage>
                                )}

                                {/* 버튼 영역 */}
                                <View className="flex-row gap-3 mt-6">
                                    <Button
                                        wrap={true}
                                        onPress={onClose}
                                        variant="outlined"
                                        color={"success"}>
                                        취소
                                    </Button>
                                    <Button
                                        wrap={true}
                                        onPress={handleSubmit(onSubmit)}
                                        disabled={isSubmitting}>
                                        {isSubmitting ? "처리중..." : isEditMode ? "수정" : "등록"}
                                    </Button>
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
