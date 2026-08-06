import { useEffect } from "react";
import { Alert, Platform, ScrollView, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import productApi from "@/api/productApi";
import { ProductInputType, productSchema } from "@/schemas/user/createProductSchema";

export default function ProductFormPage() {
    const router = useRouter();
    const { fridgeId, productId } = useLocalSearchParams<{
        fridgeId: string;
        productId?: string;
    }>();

    const isEditMode = !!productId;

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductInputType>({
        resolver: zodResolver(productSchema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            quantity: undefined as any, // 숫자 필드는 초기값을 비워둡니다
            unit: "EA",
            storageType: "REFRIGERATED",
            expirationDate: "",
            categoryId: undefined as any,
            price: undefined,
            memo: "",
            addMethod: "MANUAL",
            status: "STORED",
        },
    });

    useEffect(() => {
        if (!isEditMode || !productId) return;

        const fetchProduct = async () => {
            try {
                const data = await productApi.getProductById(Number(productId));

                // YYYY-MM-DD 형식으로 변환하여 input에 세팅
                const formattedDate = data.expirationDate
                    ? data.expirationDate.substring(0, 10)
                    : "";

                reset({
                    name: data.name,
                    quantity: data.quantity,
                    unit: data.unit,
                    storageType: data.storageType,
                    expirationDate: formattedDate,
                    categoryId: data.categoryId,
                    price: data.price ?? undefined,
                    memo: data.memo ?? "",
                    addMethod: data.addMethod,
                    status: data.status,
                });
            } catch (error) {
                console.error("상품 정보 불러오기 실패:", error);
            }
        };

        fetchProduct().then(() => {});
    }, [productId, isEditMode, reset]);

    const handleSave = async (data: ProductInputType) => {
        try {
            // 💡 팀원분의 스키마 덕분에 data.expirationDate는 이미 Date 객체입니다!
            const submitData = {
                ...data,
                // 백엔드 포맷에 맞게 ISO 문자열로 변환 (필요시 slice(0, 19) + "Z" 등으로 가공 가능)
                expirationDate: data.expirationDate.toISOString(),
            };

            if (isEditMode) {
                await productApi.updateProduct(Number(productId), submitData as any);
            } else {
                if (!fridgeId) throw new Error("냉장고 ID가 없습니다.");
                await productApi.createProduct(Number(fridgeId), submitData as any);
            }

            const successMessage = isEditMode
                ? "성공적으로 수정되었습니다."
                : "성공적으로 추가되었습니다.";
            if (Platform.OS === "web") {
                alert(successMessage);
                router.back();
            } else {
                Alert.alert("완료", successMessage, [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "오류가 발생했습니다.";
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className="flex-1 bg-bg-default items-center">
            <View className="flex-1 w-full max-w-[480px]">
                <Title
                    title={isEditMode ? "식재료 수정" : "식재료 추가"}
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    forceCenter={true}
                />

                <ScrollView
                    className="flex-1 px-6 pt-4"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}>
                    <View className="mb-2">
                        {/* 상품명 */}
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="상품명"
                                    placeholder="예: 신선한 계란"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={errors.name?.message}
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
                                    // 빈 값이면 undefined, 숫자가 입력되면 number 타입으로 전달
                                    onChangeText={text => {
                                        const num = parseInt(text.replace(/[^0-9]/g, ""), 10);
                                        onChange(isNaN(num) ? undefined : num);
                                    }}
                                    value={value?.toString()}
                                    errorMessage={errors.quantity?.message}
                                />
                            )}
                        />

                        {/* 가격 (옵션) */}
                        <Controller
                            control={control}
                            name="price"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label="가격 (선택)"
                                    placeholder="가격을 입력해주세요 (숫자만)"
                                    keyboardType="numeric"
                                    onBlur={onBlur}
                                    onChangeText={text => {
                                        const num = parseInt(text.replace(/[^0-9]/g, ""), 10);
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

                        {/* 유통기한 (자동 하이픈 마스킹 적용) */}
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
                                        const num = parseInt(text.replace(/[^0-9]/g, ""), 10);
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
                                    className="mb-10"
                                />
                            )}
                        />
                    </View>

                    {/* Root 에러 메시지 */}
                    {errors.root?.message && (
                        <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                            {errors.root?.message}
                        </ErrorMessage>
                    )}

                    {/* 버튼 */}
                    <View className="mt-8">
                        <Button onPress={handleSubmit(handleSave)} disabled={isSubmitting}>
                            {isEditMode ? "수정하기" : "저장하기"}
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
