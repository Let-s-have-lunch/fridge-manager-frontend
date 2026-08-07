import { useEffect, useState, useCallback } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    View,
    LayoutRectangle,
    Keyboard,
    Pressable,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input"; // 👈 Input 추가
import DropdownSelect from "@/components/common/input/DropdownSelect"; // 👈 팀원 컴포넌트 추가
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import TextComponent from "@/components/common/text/TextComponent";

import { useSwipeDown } from "@/hooks/useSwipeDown";
import { productSchema, ProductInputType } from "@/schemas/user/productSchema";
import { useHomeStore } from "@/stores/home/productStore";
import { ProductDetailItemType } from "@/types/product";
import productApi from "@/api/user/productApi";

// 💡 백엔드 전송 데이터와 UI 표시 텍스트 매핑
const CATEGORIES = [
    { label: "채소", value: 1 },
    { label: "과일", value: 2 },
    { label: "육류", value: 3 },
    { label: "수산물", value: 4 },
    { label: "유제품", value: 5 },
    { label: "기타", value: 6 },
];
const UNITS = [
    { label: "개", value: "EA" },
    { label: "g", value: "G" },
    { label: "kg", value: "KG" },
    { label: "ml", value: "ML" },
    { label: "L", value: "L" },
];
const STORAGES = [
    { label: "냉장", value: "REFRIGERATED" },
    { label: "냉동", value: "FROZEN" },
    { label: "실온", value: "ROOM_TEMP" },
];
const STATUSES = [
    { label: "보관", value: "STORED" },
    { label: "소비 완료", value: "CONSUMED" },
    { label: "폐기", value: "DISCARDED" },
];

interface Props {
    visible: boolean;
    onClose: () => void;
    initialData: ProductDetailItemType | null;
    onRefresh: () => Promise<void>;
}

export default function ProductFormModal({ visible, onClose, initialData, onRefresh }: Props) {
    const swipeDownHandlers = useSwipeDown(onClose);
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);

    // 드롭다운 상태 관리
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(null);

    const {
        control,
        reset,
        handleSubmit,
        setError,
        setValue,
        watch, // 👈 드롭다운 렌더링 시 현재 값을 읽기 위해 추가
        formState: { errors, isSubmitting },
    } = useForm<ProductInputType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            memo: "",
            categoryId: 1, // 기본값 채소
            storageType: "REFRIGERATED",
            quantity: "" as any,
            unit: "EA",
            price: "" as any,
            expirationDate: "",
            status: "STORED",
        },
        mode: "onTouched",
    });

    const isEditMode = !!initialData;

    // 드롭다운 핸들러
    const handleDropdownChange = useCallback(
        (id: string, isOpen: boolean, layout?: LayoutRectangle) => {
            if (isOpen) {
                Keyboard.dismiss(); // 드롭다운 열 때 키보드 닫기
                setActiveDropdown(id);
                setDropdownLayout(layout || null);
            } else if (activeDropdown === id) {
                setActiveDropdown(null);
                setDropdownLayout(null);
            }
        },
        [activeDropdown],
    );

    // 글로벌 드롭다운 리스트 렌더링
    const renderActiveDropdownList = useCallback(() => {
        if (!activeDropdown || !dropdownLayout) return null;

        let options: { label: string; value: any }[] = [];
        let onSelect: (value: any) => void = () => {};
        let currentValue: any = "";

        // 현재 열려있는 드롭다운 식별 및 매핑
        switch (activeDropdown) {
            case "category":
                options = CATEGORIES;
                onSelect = val => setValue("categoryId", val, { shouldValidate: true });
                currentValue = watch("categoryId");
                break;
            case "unit":
                options = UNITS;
                onSelect = val => setValue("unit", val, { shouldValidate: true });
                currentValue = watch("unit");
                break;
            case "storageType":
                options = STORAGES;
                onSelect = val => setValue("storageType", val, { shouldValidate: true });
                currentValue = watch("storageType");
                break;
            case "status":
                options = STATUSES;
                onSelect = val => setValue("status", val, { shouldValidate: true });
                currentValue = watch("status");
                break;
            default:
                return null;
        }

        return (
            <View
                className="absolute z-[9999] rounded-[10px] border border-gray-200 bg-white shadow-xl"
                style={{
                    top: dropdownLayout.y,
                    left: dropdownLayout.x,
                    width: dropdownLayout.width,
                    maxHeight: 200,
                    elevation: 10,
                }}>
                <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled">
                    {options.map((option, index) => (
                        <Pressable
                            key={index}
                            className={`px-4 py-3 ${
                                index !== options.length - 1 ? "border-b border-gray-100" : ""
                            }`}
                            onPress={() => {
                                onSelect(option.value); // React Hook Form에 값 세팅!
                                setActiveDropdown(null);
                                setDropdownLayout(null);
                            }}>
                            <TextComponent
                                className={`text-[15px] ${
                                    currentValue === option.value
                                        ? "font-bold text-primary-main"
                                        : "text-text-default"
                                }`}>
                                {option.label}
                            </TextComponent>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        );
    }, [activeDropdown, dropdownLayout, watch, setValue]);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const displayCreatedAt = initialData?.createdAt
        ? initialData.createdAt.substring(0, 10)
        : getTodayDate();

    useEffect(() => {
        if (visible) {
            if (initialData) {
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
                    categoryId: 1, // 초기화 시 '채소'
                    storageType: "REFRIGERATED",
                    quantity: "" as any,
                    unit: "EA",
                    price: "" as any,
                    expirationDate: "",
                    status: "STORED",
                });
            }
        } else {
            // 닫힐 때 드롭다운 초기화
            setActiveDropdown(null);
            setDropdownLayout(null);
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
        <Modal visible={visible} transparent={true} animationType={"fade"} onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/50 md:justify-center md:items-center">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 w-full justify-end md:justify-center md:items-center">
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View className="absolute inset-0" />
                    </TouchableWithoutFeedback>

                    <View className="w-full max-h-[85%] px-6 pt-4 pb-12 bg-bg-default rounded-t-[36px] md:max-w-[480px] md:max-h-[90%] md:pt-8 md:rounded-[36px] z-10">
                        <Title
                            title={isEditMode ? "식재료 수정" : "식재료 추가"}
                            className="h-auto pb-4 mb-4"
                            textClassName={"text-2xl"}
                        />

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            onScrollBeginDrag={() => {
                                // 스크롤 시 열려있는 드롭다운 닫기
                                if (activeDropdown) {
                                    setActiveDropdown(null);
                                    setDropdownLayout(null);
                                }
                            }}
                            contentContainerStyle={{ paddingBottom: 20 }}>
                            {/* 1. 카테고리 (Dropdown) */}
                            <Controller
                                control={control}
                                name="categoryId"
                                render={({ field: { value } }) => {
                                    const currentLabel =
                                        CATEGORIES.find(c => c.value === value)?.label || "";
                                    return (
                                        <InputGroup
                                            label="카테고리"
                                            errorMessage={errors.categoryId?.message}>
                                            <DropdownSelect
                                                isOpen={activeDropdown === "category"}
                                                value={currentLabel}
                                                options={CATEGORIES.map(c => c.label)}
                                                onSelect={() => {}} // 글로벌 리스트에서 직접 값 주입
                                                onOpenChange={(isOpen, layout) =>
                                                    handleDropdownChange("category", isOpen, layout)
                                                }
                                            />
                                        </InputGroup>
                                    );
                                }}
                            />

                            {/* 2. 제품명 */}
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup label="제품명" errorMessage={errors.name?.message}>
                                        <Input
                                            placeholder="제품명을 입력해주세요."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </InputGroup>
                                )}
                            />

                            {/* 3. 등록수량 & 단위 (반반 배치) */}
                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <Controller
                                        control={control}
                                        name="quantity"
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <InputGroup
                                                label="등록수량"
                                                errorMessage={errors.quantity?.message}>
                                                <Input
                                                    placeholder="0"
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
                                                />
                                            </InputGroup>
                                        )}
                                    />
                                </View>
                                <View className="flex-1">
                                    <Controller
                                        control={control}
                                        name="unit"
                                        render={({ field: { value } }) => {
                                            const currentLabel =
                                                UNITS.find(u => u.value === value)?.label || "";
                                            return (
                                                <InputGroup
                                                    label="단위"
                                                    errorMessage={errors.unit?.message}>
                                                    <DropdownSelect
                                                        isOpen={activeDropdown === "unit"}
                                                        value={currentLabel}
                                                        options={UNITS.map(u => u.label)}
                                                        onSelect={() => {}}
                                                        onOpenChange={(isOpen, layout) =>
                                                            handleDropdownChange(
                                                                "unit",
                                                                isOpen,
                                                                layout,
                                                            )
                                                        }
                                                    />
                                                </InputGroup>
                                            );
                                        }}
                                    />
                                </View>
                            </View>

                            {/* 4. 저장방식 (Dropdown) */}
                            <Controller
                                control={control}
                                name="storageType"
                                render={({ field: { value } }) => {
                                    const currentLabel =
                                        STORAGES.find(s => s.value === value)?.label || "";
                                    return (
                                        <InputGroup
                                            label="저장방식"
                                            errorMessage={errors.storageType?.message}>
                                            <DropdownSelect
                                                isOpen={activeDropdown === "storageType"}
                                                value={currentLabel}
                                                options={STORAGES.map(s => s.label)}
                                                onSelect={() => {}}
                                                onOpenChange={(isOpen, layout) =>
                                                    handleDropdownChange(
                                                        "storageType",
                                                        isOpen,
                                                        layout,
                                                    )
                                                }
                                            />
                                        </InputGroup>
                                    );
                                }}
                            />

                            {/* 5. 등록일 (읽기 전용) */}
                            <InputGroup label="등록일">
                                <Input
                                    value={displayCreatedAt}
                                    editable={false}
                                    style={{ color: "#777777" }}
                                />
                            </InputGroup>

                            {/* 6. 소비기한 */}
                            <Controller
                                control={control}
                                name="expirationDate"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup
                                        label="소비기한"
                                        errorMessage={errors.expirationDate?.message}>
                                        <Input
                                            placeholder="YYYYMMDD (예: 20260810)"
                                            keyboardType="number-pad"
                                            maxLength={8} // 👈 하이픈이 빠지므로 10에서 8로 수정
                                            onBlur={onBlur}
                                            onChangeText={text => {
                                                // 👈 불필요한 하이픈 로직 제거, 오직 숫자만 추출
                                                const cleaned = text.replace(/[^0-9]/g, "");
                                                onChange(cleaned);
                                            }}
                                            value={value}
                                        />
                                    </InputGroup>
                                )}
                            />

                            {/* 7. 보관상태 (Dropdown) */}
                            <Controller
                                control={control}
                                name="status"
                                render={({ field: { value } }) => {
                                    const currentLabel =
                                        STATUSES.find(s => s.value === value)?.label || "";
                                    return (
                                        <InputGroup
                                            label="보관상태"
                                            errorMessage={errors.status?.message}>
                                            <DropdownSelect
                                                isOpen={activeDropdown === "status"}
                                                value={currentLabel}
                                                options={STATUSES.map(s => s.label)}
                                                onSelect={() => {}}
                                                onOpenChange={(isOpen, layout) =>
                                                    handleDropdownChange("status", isOpen, layout)
                                                }
                                            />
                                        </InputGroup>
                                    );
                                }}
                            />

                            {/* 8. 가격 */}
                            <Controller
                                control={control}
                                name="price"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup label="가격" errorMessage={errors.price?.message}>
                                        <Input
                                            placeholder="0"
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
                                        />
                                    </InputGroup>
                                )}
                            />

                            {/* 9. 메모 */}
                            <Controller
                                control={control}
                                name="memo"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <InputGroup label="메모" errorMessage={errors.memo?.message}>
                                        <Input
                                            placeholder="메모를 입력해주세요."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            multiline={true}
                                            style={{ height: 120, textAlignVertical: "top" }}
                                        />
                                    </InputGroup>
                                )}
                            />

                            {/* 에러 메시지 */}
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
                                    color="success">
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
                </KeyboardAvoidingView>

                {/* 💡 선택 리스트 렌더링 (가장 바깥쪽, 최상단 Z-index 배치를 위해 여기에 위치) */}
                {renderActiveDropdownList()}

                {/* 💡 드롭다운 열렸을 때 백그라운드 터치 시 닫히도록 하는 투명 막 */}
                {activeDropdown && (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setActiveDropdown(null);
                            setDropdownLayout(null);
                        }}>
                        <View className="absolute inset-0 z-[999]" pointerEvents="auto" />
                    </TouchableWithoutFeedback>
                )}
            </View>
        </Modal>
    );
}
