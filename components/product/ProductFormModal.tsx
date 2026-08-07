import React from "react";
import {
    Modal,
    View,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    ScrollView,
    Pressable,
} from "react-native";
import { Controller } from "react-hook-form";

// UI 컴포넌트 임포트
import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import DropdownSelect from "@/components/common/input/DropdownSelect";
import Button from "@/components/common/button/Button";
import Input from "@/components/common/input/Input";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import DropdownOverlay from "@/components/common/input/DropdownOverlay";

// 카테고리 컴포넌트 및 기타
import CreateCategoryContent from "@/components/category/CreateCategoryContent";
import SelectCategoryContent from "@/components/category/SelectCategoryContent";
import { STATUSES, STORAGES, UNITS } from "@/constants/productOptions"; // 💡 3개 다 가져와야 합니다!

// 커스텀 훅 임포트
import { useProductForm } from "@/hooks/useProductForm";
import { ProductDetailItemType } from "@/types/product";

interface Props {
    visible: boolean;
    onClose: () => void;
    initialData: ProductDetailItemType | null;
    onRefresh: () => Promise<void>;
}

export default function ProductFormModal({ visible, onClose, initialData, onRefresh }: Props) {
    const {
        screen,
        setScreen,
        categoryMode,
        setCategoryMode,
        editingCategory,
        setEditingCategory,
        categories,
        loadCategories,
        activeDropdown,
        dropdownLayout,
        handleDropdownChange,
        closeDropdown,
        formMethods,
        isEditMode,
        onSubmit,
        displayCreatedAt,
    } = useProductForm(visible, initialData, onClose, onRefresh);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = formMethods;

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 justify-center items-center bg-black/50">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 w-full justify-center items-center">
                    <TouchableWithoutFeedback onPress={onClose}>
                        <View className="absolute inset-0" />
                    </TouchableWithoutFeedback>

                    {/* --- 1. 메인 폼 화면 --- */}
                    {screen === "form" && (
                        <View className="w-[90%] max-w-[480px] max-h-[85%] px-6 pt-8 pb-12 bg-bg-default rounded-[36px] z-10">
                            <Title
                                title={isEditMode ? "식재료 수정" : "식재료 추가"}
                                className="h-auto pb-4 mb-4"
                                textClassName="text-2xl"
                            />

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                onScrollBeginDrag={closeDropdown}
                                contentContainerStyle={{ paddingBottom: 20 }}>
                                {/* 1. 카테고리 */}
                                <Controller
                                    control={control}
                                    name="categoryId"
                                    render={({ field: { value } }) => (
                                        <InputGroup label="카테고리">
                                            <Pressable onPress={() => setScreen("selectCategory")}>
                                                <Input
                                                    value={
                                                        categories.find(c => c.id === value)
                                                            ?.name || ""
                                                    }
                                                    editable={false}
                                                    pointerEvents="none"
                                                />
                                            </Pressable>
                                        </InputGroup>
                                    )}
                                />

                                {/* 2. 제품명 */}
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="제품명"
                                            errorMessage={errors.name?.message}
                                            placeholder="제품명을 입력해주세요."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />

                                {/* 3. 수량 & 단위 */}
                                <View className="flex-row gap-3">
                                    <View className="flex-1">
                                        <Controller
                                            control={control}
                                            name="quantity"
                                            render={({ field: { onChange, onBlur, value } }) => (
                                                <InputGroup
                                                    label="등록수량"
                                                    errorMessage={errors.quantity?.message}
                                                    placeholder="0"
                                                    keyboardType="numeric"
                                                    onBlur={onBlur}
                                                    selectTextOnFocus
                                                    onChangeText={t => {
                                                        const clean = t.replace(/[^0-9]/g, "");
                                                        onChange(
                                                            clean === "" ? "" : parseInt(clean, 10),
                                                        );
                                                    }}
                                                    value={value?.toString() ?? ""}
                                                />
                                            )}
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Controller
                                            control={control}
                                            name="unit"
                                            render={({ field: { value } }) => (
                                                <InputGroup
                                                    label="단위"
                                                    errorMessage={errors.unit?.message}>
                                                    <DropdownSelect
                                                        isOpen={activeDropdown === "unit"}
                                                        value={
                                                            UNITS.find(u => u.value === value)
                                                                ?.label || ""
                                                        }
                                                        options={[]}
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
                                            )}
                                        />
                                    </View>
                                </View>

                                {/* 4. 저장방식 */}
                                <Controller
                                    control={control}
                                    name="storageType"
                                    render={({ field: { value } }) => (
                                        <InputGroup
                                            label="저장방식"
                                            errorMessage={errors.storageType?.message}>
                                            <DropdownSelect
                                                isOpen={activeDropdown === "storageType"}
                                                value={
                                                    STORAGES.find(s => s.value === value)?.label ||
                                                    ""
                                                }
                                                options={[]}
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
                                    )}
                                />

                                {/* 5. 등록일 */}
                                <InputGroup
                                    label="등록일"
                                    value={displayCreatedAt}
                                    editable={false}
                                    style={{ color: "#777777" }}
                                />

                                {/* 6. 소비기한 */}
                                <Controller
                                    control={control}
                                    name="expirationDate"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="소비기한"
                                            errorMessage={errors.expirationDate?.message}
                                            placeholder="YYYYMMDD (예: 20260810)"
                                            keyboardType="number-pad"
                                            maxLength={8}
                                            onBlur={onBlur}
                                            onChangeText={t => {
                                                const clean = t.replace(/[^0-9]/g, "");
                                                onChange(clean);
                                            }}
                                            value={value}
                                        />
                                    )}
                                />

                                {/* 7. 보관상태 */}
                                <Controller
                                    control={control}
                                    name="status"
                                    render={({ field: { value } }) => (
                                        <InputGroup
                                            label="보관상태"
                                            errorMessage={errors.status?.message}>
                                            <DropdownSelect
                                                isOpen={activeDropdown === "status"}
                                                value={
                                                    STATUSES.find(s => s.value === value)?.label ||
                                                    ""
                                                }
                                                options={[]}
                                                onSelect={() => {}}
                                                onOpenChange={(isOpen, layout) =>
                                                    handleDropdownChange("status", isOpen, layout)
                                                }
                                            />
                                        </InputGroup>
                                    )}
                                />

                                {/* 8. 가격 */}
                                <Controller
                                    control={control}
                                    name="price"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="가격"
                                            errorMessage={errors.price?.message}
                                            placeholder="0"
                                            keyboardType="numeric"
                                            onBlur={onBlur}
                                            onChangeText={t => {
                                                const clean = t.replace(/[^0-9]/g, "");
                                                onChange(clean === "" ? null : parseInt(clean, 10));
                                            }}
                                            value={value?.toString() ?? ""}
                                            selectTextOnFocus
                                        />
                                    )}
                                />

                                {/* 9. 메모 */}
                                <Controller
                                    control={control}
                                    name="memo"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup
                                            label="메모"
                                            errorMessage={errors.memo?.message}
                                            placeholder="메모를 입력해주세요."
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            multiline={true}
                                            style={{ height: 120, textAlignVertical: "top" }}
                                        />
                                    )}
                                />

                                {/* 에러 메시지 */}
                                {errors.root?.message && (
                                    <ErrorMessage className="text-center mt-2 mb-2">
                                        {errors.root?.message}
                                    </ErrorMessage>
                                )}

                                {/* 하단 버튼 영역 */}
                                <View className="flex-row gap-3 mt-6">
                                    <Button
                                        wrap
                                        onPress={onClose}
                                        variant="outlined"
                                        color="success">
                                        취소
                                    </Button>
                                    <Button
                                        wrap
                                        onPress={handleSubmit(onSubmit)}
                                        disabled={isSubmitting}>
                                        {isSubmitting ? "처리중..." : isEditMode ? "수정" : "등록"}
                                    </Button>
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* --- 2. 카테고리 선택 화면 --- */}
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
                                onSelect={cat => {
                                    setValue("categoryId", cat.id, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    });
                                    setScreen("form");
                                }}
                                onAddCategory={() => {
                                    setCategoryMode("create");
                                    setEditingCategory(null);
                                    setScreen("createCategory");
                                }}
                                onEditCategory={cat => {
                                    setCategoryMode("edit");
                                    setEditingCategory(cat);
                                    setScreen("createCategory");
                                }}
                            />
                        </View>
                    )}

                    {/* --- 3. 카테고리 생성 화면 --- */}
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
                                mode={categoryMode}
                                category={editingCategory ?? undefined}
                                onClose={() => {
                                    setEditingCategory(null);
                                    setScreen("selectCategory");
                                }}
                                onComplete={async () => {
                                    await loadCategories();
                                    setEditingCategory(null);
                                    setScreen("selectCategory");
                                }}
                            />
                        </View>
                    )}
                </KeyboardAvoidingView>

                {/* 드롭다운 백그라운드 터치 닫기 */}
                {activeDropdown && (
                    <TouchableWithoutFeedback onPress={closeDropdown}>
                        <View className="absolute inset-0 z-[9990]" pointerEvents="auto" />
                    </TouchableWithoutFeedback>
                )}

                {/* 분리해낸 글로벌 드롭다운 컴포넌트 렌더링 */}
                <DropdownOverlay
                    activeDropdown={activeDropdown}
                    dropdownLayout={dropdownLayout}
                    currentValue={activeDropdown ? watch(activeDropdown as any) : null}
                    onSelect={(id, val) => setValue(id as any, val, { shouldValidate: true })}
                    onClose={closeDropdown}
                />
            </View>
        </Modal>
    );
}
