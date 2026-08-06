import React, { useState, useCallback, useRef } from "react";
import {
    Pressable,
    ScrollView,
    View,
    LayoutRectangle,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Input from "@/components/common/input/Input";
import InputGroup from "@/components/common/input/InputGroup";
import TextComponent from "@/components/common/text/TextComponent";
import DropdownSelect from "@/components/common/input/DropdownSelect";

import productApi from "@/api/user/productApi";
import { useHomeStore } from "@/stores/home/productStore";

// 드롭다운 옵션 목록
const CATEGORY_OPTIONS = ["채소", "과일", "육류", "수산물", "유제품", "기타"];
const UNIT_OPTIONS = ["개", "g", "kg", "L"];
const STORAGE_METHOD_OPTIONS = ["냉장", "냉동", "실온"];
const STORAGE_STATUS_OPTIONS = ["보관", "사용중", "폐기"];

export default function RegisterScreen() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);

    // 선택된 냉장고 ID
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);

    // 오늘 날짜 구하기 (YYYY-MM-DD)
    const todayString = new Date().toISOString().split("T")[0];

    // 입력 상태 관리
    const [category, setCategory] = useState("채소");
    const [productName, setProductName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("개");
    const [storageMethod, setStorageMethod] = useState("냉장");
    const [storageStatus, setStorageStatus] = useState("보관");
    const [expirationDate, setExpirationDate] = useState(""); // 소비기한 추가
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
                setActiveDropdown(null);
                setDropdownLayout(null);
            }
        },
        [activeDropdown],
    );

    // 드롭다운 목록 렌더링
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
                                onSelect(option);
                                setActiveDropdown(null);
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

    const handleRegister = async () => {
        if (!selectedFridgeId) {
            Alert.alert("알림", "선택된 냉장고가 없습니다. 냉장고를 선택해주세요.");
            return;
        }

        if (!productName.trim()) {
            Alert.alert("알림", "제품명을 입력해주세요.");
            return;
        }

        if (!expirationDate.trim()) {
            Alert.alert("알림", "소비기한을 입력해주세요. (예: 2026-08-10)");
            return;
        }

        // 백엔드 매핑 테이블
        const categoryIdMap: Record<string, number> = {
            채소: 1,
            과일: 2,
            육류: 3,
            수산물: 4,
            유제품: 5,
            기타: 6,
        };

        const unitMap: Record<string, string> = {
            개: "EA",
            g: "G",
            kg: "KG",
            L: "L",
        };

        const storageTypeMap: Record<string, string> = {
            냉장: "REFRIGERATED",
            냉동: "FROZEN",
            실온: "ROOM_TEMP",
        };

        // 백엔드 스키마에 맞춘 최종 제출 데이터
        const submitData = {
            name: productName,
            categoryId: categoryIdMap[category] || 1,
            quantity: Number(quantity) || 0,
            unit: unitMap[unit] || "EA",
            storageType: storageTypeMap[storageMethod] || "REFRIGERATED",
            expirationDate: expirationDate, // YYYY-MM-DD
            price: Number(price) || 0,
            memo,
        };

        console.log("DB 전송 데이터:", submitData);

        try {
            await productApi.createProduct(selectedFridgeId, submitData as any);
            router.back();
        } catch (error: any) {
            console.error("제품 등록 실패:", error?.response?.data || error);
            Alert.alert(
                "오류",
                error?.response?.data?.message || "제품 등록 중 문제가 발생했습니다.",
            );
        }
    };

    return (
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
                    <Input editable={false} value={todayString} />
                </InputGroup>

                {/* 소비기한 */}
                <InputGroup label="소비기한">
                    <Input
                        value={expirationDate}
                        onChangeText={setExpirationDate}
                        placeholder="YYYY-MM-DD (예: 2026-08-10)"
                    />
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
