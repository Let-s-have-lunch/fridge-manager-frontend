import React, { useState, useCallback, useRef } from "react";
import {
    Pressable,
    ScrollView,
    View,
    LayoutRectangle,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Input from "@/components/common/input/Input";
import InputGroup from "@/components/common/input/InputGroup";
import TextComponent from "@/components/common/text/TextComponent";
import DropdownSelect from "@/components/common/input/DropdownSelect";

// 드롭다운 옵션 목록
const CATEGORY_OPTIONS = ["채소", "과일", "육류", "수산물", "유제품", "기타"];
const UNIT_OPTIONS = ["개", "g", "kg", "L"];
const STORAGE_METHOD_OPTIONS = ["냉장", "냉동", "실온"];
const STORAGE_STATUS_OPTIONS = ["보관", "사용중", "폐기"];

export default function RegisterScreen() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);

    // 입력 상태 관리
    const [category, setCategory] = useState("채소");
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("개");
    const [storageMethod, setStorageMethod] = useState("냉장");
    const [storageStatus, setStorageStatus] = useState("보관");
    const [price, setPrice] = useState("");
    const [memo, setMemo] = useState("");

    // 드롭다운 통합 관리 상태
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [dropdownLayout, setDropdownLayout] = useState<LayoutRectangle | null>(null);

    // 드롭다운 열기/닫기 처리 함수
    const handleDropdownChange = useCallback(
        (id: string, isOpen: boolean, layout?: LayoutRectangle) => {
            if (isOpen) {
                setActiveDropdown(id);
                setDropdownLayout(layout || null);
            } else if (activeDropdown === id) {
                // 이 ID가 닫힐 때만 null로 설정
                setActiveDropdown(null);
                setDropdownLayout(null);
            }
        },
        [activeDropdown],
    );

    // 드롭다운 목록을 렌더링하는 함수 (최상위 레이어에서 호출)
    const renderActiveDropdownList = useCallback(() => {
        if (!activeDropdown || !dropdownLayout) return null;

        let options: string[] = [];
        let onSelect: (value: string) => void = () => {};
        let currentValue: string = "";

        switch (activeDropdown) {
            case "category":
                options = CATEGORY_OPTIONS;
                onSelect = setCategory;
                currentValue = category;
                break;
            case "unit":
                options = UNIT_OPTIONS;
                onSelect = setUnit;
                currentValue = unit;
                break;
            case "storageMethod":
                options = STORAGE_METHOD_OPTIONS;
                onSelect = setStorageMethod;
                currentValue = storageMethod;
                break;
            case "storageStatus":
                options = STORAGE_STATUS_OPTIONS;
                onSelect = setStorageStatus;
                currentValue = storageStatus;
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
                    maxHeight: 200, // 최대 높이
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
                                onSelect(option);
                                setActiveDropdown(null); // 선택 시 닫기
                                setDropdownLayout(null);
                            }}>
                            <TextComponent
                                className={`text-[15px] ${
                                    currentValue === option
                                        ? "font-bold text-primary-main"
                                        : "text-text-default"
                                }`}>
                                {option}
                            </TextComponent>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        );
    }, [activeDropdown, dropdownLayout, category, unit, storageMethod, storageStatus]);

    const handleRegister = () => {
        console.log("등록 데이터:", {
            category,
            productName,
            quantity,
            unit,
            storageMethod,
            storageStatus,
            price,
            memo,
        });
    };

    return (
        // 최상위 컨테이너 레이어 (전체 화면 차지)
        <View className="flex-1">
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 bg-bg-default"
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 16,
                    paddingBottom: 40,
                }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                // 스크롤 시작 시 드롭다운 닫기 (디자인 깨짐 방지)
                onScrollBeginDrag={() => {
                    if (activeDropdown) {
                        setActiveDropdown(null);
                        setDropdownLayout(null);
                    }
                }}>
                {/* Header */}
                <View className="mb-8 flex-row items-center z-0">
                    <Pressable
                        onPress={() => router.back()}
                        className="h-10 w-10 items-center justify-center">
                        <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
                    </Pressable>
                    <View className="mr-10 flex-1 items-center">
                        <TextComponent className="text-lg font-bold text-text-default">
                            제품 등록
                        </TextComponent>
                    </View>
                </View>

                {/* 카테고리 (드롭다운) */}
                <InputGroup label="카테고리">
                    <DropdownSelect
                        isOpen={activeDropdown === "category"}
                        value={category}
                        options={CATEGORY_OPTIONS}
                        onSelect={setCategory}
                        onOpenChange={(isOpen, layout) =>
                            handleDropdownChange("category", isOpen, layout)
                        }
                    />
                </InputGroup>

                {/* 제품명 */}
                <InputGroup label="제품명">
                    <Input
                        value={productName}
                        onChangeText={setProductName}
                        placeholder="제품명을 입력해주세요."
                    />
                </InputGroup>

                {/* 등록수량 + 단위 (드롭다운) */}
                {/* 기존의 z-40 gap-3 뭉침 문제를 View 컨테이너에 flex-none을 주어 해결했습니다. */}
                <View className="flex-row gap-3 z-10 flex-none">
                    <InputGroup wrap label="등록수량">
                        <Input
                            value={quantity}
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                            placeholder="0"
                        />
                    </InputGroup>
                    <InputGroup wrap label="단위">
                        <DropdownSelect
                            isOpen={activeDropdown === "unit"}
                            value={unit}
                            options={UNIT_OPTIONS}
                            onSelect={setUnit}
                            onOpenChange={(isOpen, layout) =>
                                handleDropdownChange("unit", isOpen, layout)
                            }
                        />
                    </InputGroup>
                </View>

                {/* 저장방식 (드롭다운) */}
                <InputGroup label="저장방식">
                    <DropdownSelect
                        isOpen={activeDropdown === "storageMethod"}
                        value={storageMethod}
                        options={STORAGE_METHOD_OPTIONS}
                        onSelect={setStorageMethod}
                        onOpenChange={(isOpen, layout) =>
                            handleDropdownChange("storageMethod", isOpen, layout)
                        }
                    />
                </InputGroup>

                {/* 등록일 */}
                <InputGroup label="등록일">
                    <Input editable={false} value="2026.08.04" />
                </InputGroup>

                {/* 소비기한 */}
                <InputGroup label="소비기한">
                    <Pressable onPress={() => {}}>
                        <View pointerEvents="none">
                            <Input editable={false} placeholder="날짜를 선택해주세요." />
                        </View>
                    </Pressable>
                </InputGroup>

                {/* 보관상태 (드롭다운) */}
                <InputGroup label="보관상태">
                    <DropdownSelect
                        isOpen={activeDropdown === "storageStatus"}
                        value={storageStatus}
                        options={STORAGE_STATUS_OPTIONS}
                        onSelect={setStorageStatus}
                        onOpenChange={(isOpen, layout) =>
                            handleDropdownChange("storageStatus", isOpen, layout)
                        }
                    />
                </InputGroup>

                {/* 가격 */}
                <InputGroup label="가격">
                    <Input
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                        placeholder="0"
                    />
                </InputGroup>

                {/* 메모 */}
                <InputGroup label="메모">
                    <Input
                        value={memo}
                        onChangeText={setMemo}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        className="h-32"
                        placeholder="메모를 입력해주세요."
                    />
                </InputGroup>

                {/* 등록 버튼 */}
                <Pressable
                    className="mt-6 h-14 items-center justify-center rounded-[15px] bg-primary-main z-0"
                    onPress={handleRegister}>
                    <TextComponent className="text-[18px] font-bold text-white">
                        등록하기
                    </TextComponent>
                </Pressable>
            </ScrollView>

            {renderActiveDropdownList()}

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
    );
}
