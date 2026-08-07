import React, { useState, useRef, useCallback } from "react";
import { View, Pressable, ScrollView, LayoutRectangle, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Input from "@/components/common/input/Input";

interface DropdownSelectProps {
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    placeholder?: string;
    // 부모에게 자신의 위치와 열림 상태를 전달하는 콜백 추가
    onOpenChange: (isOpen: boolean, layout?: LayoutRectangle) => void;
    isOpen: boolean; // 부모가 관리하는 열림 상태
}

export default function DropdownSelect({
    value,
    placeholder = "선택해주세요",
    onOpenChange,
    isOpen,
}: DropdownSelectProps) {
    const containerRef = useRef<View>(null); // 자신의 위치를 측정하기 위한 ref

    const handleToggle = useCallback(() => {
        if (!isOpen) {
            // 열 때 자신의 위치를 측정
            containerRef.current?.measureInWindow((x, y, width, height) => {
                onOpenChange(true, { x, y: y + height + 4, width, height });
            });
        } else {
            // 닫을 때
            onOpenChange(false);
        }
    }, [isOpen, onOpenChange]);

    return (
        // 여기에 relative z-50을 모두 제거했습니다.
        <View ref={containerRef} pointerEvents="box-none">
            {/* 선택 영역 (항상 visible) */}
            <Pressable onPress={handleToggle}>
                <View pointerEvents="none">
                    <Input
                        editable={false}
                        value={value}
                        placeholder={placeholder}
                        className="pr-10"
                    />
                </View>
                <Ionicons
                    name={isOpen ? "chevron-down" : "chevron-forward"}
                    size={18}
                    color="#9CA3AF"
                    style={{
                        position: "absolute",
                        right: 16,
                        top: "50%",
                        marginTop: -9,
                    }}
                />
            </Pressable>
        </View>
    );
}
