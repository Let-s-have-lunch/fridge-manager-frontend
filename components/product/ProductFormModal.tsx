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
import { Category } from "@/types/category";
import categoryApi from "@/api/user/categoryApi";
import SelectCategoryContent from "@/components/category/SelectCategoryContent";
import CreateCategoryContent from "@/components/category/CreateCategoryContent";

// 💡 백엔드 전송 데이터와 UI 표시 텍스트 매핑

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
    { label: "소비", value: "CONSUMED" },
    { label: "폐기", value: "DISCARDED" },
];

interface Props {
    visible: boolean;
    onClose: () => void;
    initialData: ProductDetailItemType | null;
    onRefresh: () => Promise<void>;
}

export default function ProductFormModal({ visible, onClose, initialData, onRefresh }: Props) {
    const [screen, setScreen] = useState<"form" | "selectCategory" | "createCategory" | "editCategory" >("form");

    const swipeDownHandlers = useSwipeDown(onClose);
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();

    const handleEditCategory = (category: Category) => {
        setSelectedCategory(category);
        setScreen("editCategory");
    };

    const loadCategories = async () => {
        const result = await categoryApi.getCategoryList();
        setCategories(result);
    };

    useEffect(() => {
        if (visible) {
            loadCategories();
        }
    }, [visible]);

    // 드롭다운 상태 관리
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(null);

    const {
        control,
        reset,
        handleSubmit,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductInputType>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            memo: "",
            categoryId: 1, // 기본값 채소
            storageType: "REFRIGERATED",
            quantity: 1,
            unit: "EA",
            price: 0,
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
                className="absolute z-[9999] rounded-[10px] border border-gray-200 dark:border-gray-700 bg-bg-default shadow-xl overflow-hidden"
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
                                index !== options.length - 1
                                    ? "border-b border-gray-100 dark:border-gray-700"
                                    : ""
                            }`}
                            onPress={() => {
                                onSelect(option.value);
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
                    categoryId: 1,
                    storageType: "REFRIGERATED",
                    quantity: 1,
                    unit: "EA",
                    price: 0,
                    expirationDate: "",
                    status: "STORED",
                });
            }
        } else {
            setActiveDropdown(null);
            setDropdownLayout(null);
        }
    }, [visible, initialData, reset]);

    const onSubmit = async (data: ProductInputType) => {
        try {
            // 👇 data에서 price도 따로 분리(구조분해할당)해서 꺼내줍니다.
            const { expirationDate, price, ...prevInput } = data;
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
                // 👇 백엔드로 보낼 때, price가 null이면 undefined로 바꿔서 전송 항목에서 아예 제외시킵니다!
                price: price === null ? undefined : price,
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
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 items-center justify-center bg-black/50">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    className="flex-1 w-full items-center justify-center">
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View className="absolute inset-0" />
                    </TouchableWithoutFeedback>

                    {screen === "form" && (
                        <View
                            className="w-[90%] max-w-[480px] max-h-[75%] bg-bg-default rounded-[28px] px-6 pt-6 pb-8"
                            style={{
                                elevation: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.2,
                                shadowRadius: 12,
                                shadowOffset: { width: 0, height: 4 },
                            }}>
                            <Title
                                title={isEditMode ? "식재료 수정" : "식재료 추가"}
                                className="h-auto pb-4 mb-4"
                                textClassName="text-2xl text-center text-text-default"
                            />

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                contentContainerStyle={{ paddingBottom: 20 }}>
                                {/* 1. 카테고리 (Dropdown) */}
                                <Controller
                                    control={control}
                                    name="categoryId"
                                    render={({ field: { value } }) => {
                                        const currentLabel =
                                            categories.find(c => c.id === value)?.name || "";
                                        return (
                                            <InputGroup label="카테고리">
                                                <Pressable
                                                    onPress={() => setScreen("selectCategory")}>
                                                    <Input
                                                        value={currentLabel}
                                                        editable={false}
                                                        pointerEvents="none"
                                                    />
                                                </Pressable>
                                            </InputGroup>
                                        );
                                    }}
                                />

                                {/* 2. 제품명 */}
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup label="제품명">
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
                                                <InputGroup label="등록수량">
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
                                                    <InputGroup label="단위">
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
                                            <InputGroup label="저장방식">
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
                                        <InputGroup label="소비기한">
                                            <Input
                                                placeholder="YYYYMMDD (예: 2026-08-10)"
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
                                            <InputGroup label="보관상태">
                                                <DropdownSelect
                                                    isOpen={activeDropdown === "status"}
                                                    value={currentLabel}
                                                    options={STATUSES.map(s => s.label)}
                                                    onSelect={() => {}}
                                                    onOpenChange={(isOpen, layout) =>
                                                        handleDropdownChange(
                                                            "status",
                                                            isOpen,
                                                            layout,
                                                        )
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
                                        <InputGroup label="가격">
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
                                        <InputGroup label="메모">
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
                    )}
                    {screen === "selectCategory" && (
                        <View
                            className="w-[90%] max-w-[520px] max-h-[80%] bg-white rounded-[28px] overflow-hidden"
                            style={{
                                elevation: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.2,
                                shadowRadius: 12,
                                shadowOffset: { width: 0, height: 4 },
                            }}>
                            <SelectCategoryContent
                                categories={categories}
                                onClose={() => setScreen("form")}
                                onSelect={category => {
                                    setValue("categoryId", category.id, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });

                                    setScreen("form");
                                }}
                                onAddCategory={() => setScreen("createCategory")}
                                onEditCategory={handleEditCategory}
                            />
                        </View>
                    )}

                    {screen === "createCategory" && (
                        <View
                            className="w-[90%] max-w-[420px] bg-white rounded-[28px] overflow-hidden"
                            style={{
                                elevation: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.2,
                                shadowRadius: 12,
                                shadowOffset: { width: 0, height: 4 },
                            }}>
                            <CreateCategoryContent
                                mode="create"
                                onClose={() => setScreen("selectCategory")}
                                onComplete={async () => {
                                    await loadCategories();
                                    setScreen("selectCategory");
                                }}
                            />
                        </View>
                    )}
                    {screen === "editCategory" && (
                        <View
                            className="w-[90%] max-w-[420px] bg-white rounded-[28px] overflow-hidden"
                            style={{
                                elevation: 12,
                                shadowColor: "#000",
                                shadowOpacity: 0.2,
                                shadowRadius: 12,
                                shadowOffset: { width: 0, height: 4 },
                            }}>
                            <CreateCategoryContent
                                mode="edit"
                                category={selectedCategory}
                                onClose={() => setScreen("selectCategory")}
                                onComplete={async () => {
                                    await loadCategories();
                                    setScreen("selectCategory");
                                }}
                            />
                        </View>
                    )}
                </KeyboardAvoidingView>

                {/* 선택 리스트 렌더링 */}
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
