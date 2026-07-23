import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ShoppingItem } from "../../../types/shoppingList";
import * as api from "../../../api/shoppingListApi";
import { ShoppingListItem } from "../../../component/shoppingList/ShoppingListItem";
import { AddShoppingItem } from "../../../component/shoppingList/AddShoppingItem";

const USER_ID = 1;

export default function ShoppingListScreen() {
    const router = useRouter();

    // 🌟 [달력 연동 대비] 고정 날짜 대신 상태(State)로 관리하여 나중에 달력과 쉽게 붙일 수 있게 확장!
    const [selectedDate, setSelectedDate] = useState<string>("2026-07-23");

    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false); // 🌟 당겨서 새로고침 상태

    const fetchItems = useCallback(async (dateString: string, isRefresh = false) => {
        try {
            if (!isRefresh) setIsLoading(true);
            const data = await api.getShoppingItems(USER_ID, dateString);
            setItems(data);
        } catch (error) {
            console.error("목록 불러오기 실패:", error);
            // 백엔드 연동 전 UI 테스트용 더미 데이터
            setItems([
                { id: 1, memo: "무 1개", date: dateString, isChecked: false },
                { id: 2, memo: "파 1개", date: dateString, isChecked: false },
            ]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchItems(selectedDate);
    }, [selectedDate, fetchItems]);

    // 🌟 당겨서 새로고침 핸들러
    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchItems(selectedDate, true);
    };

    const handleToggle = async (itemId: number) => {
        // 낙관적 업데이트 (UI 먼저 빠르게 변경)
        setItems(prev =>
            prev.map(item => (item.id === itemId ? { ...item, isChecked: !item.isChecked } : item)),
        );

        try {
            await api.toggleShoppingTodo(USER_ID, itemId);
        } catch (error) {
            alert("상태 변경에 실패했습니다.");
            fetchItems(selectedDate); // 실패 시 원복
        }
    };

    const handleAddItem = async (memo: string) => {
        try {
            const newItem = await api.createShoppingItem(USER_ID, { memo, date: selectedDate });
            setItems(prev => [...prev, newItem]);
        } catch (error) {
            const tempItem: ShoppingItem = {
                id: Date.now(),
                memo,
                date: selectedDate,
                isChecked: false,
            };
            setItems(prev => [...prev, tempItem]);
        }
    };

    const handleDelete = async (itemId: number) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        try {
            await api.deleteShoppingItem(USER_ID, itemId);
        } catch (error) {
            console.error("삭제 실패:", error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-bg-paper">
            {/* 상단 헤더 (커스텀 물감 및 실제 라우터 뒤로가기 연결) */}
            <View className="flex-row items-center px-5 py-4 border-b border-divider bg-bg-paper">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="mr-3 p-1"
                    accessibilityLabel="뒤로가기">
                    <Text className="text-text-secondary text-lg font-bold">←</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text">장보기 리스트</Text>
            </View>

            {/* 메인 스크롤 리스트 영역 (새로고침 기능 추가) */}
            <ScrollView
                className="flex-1 px-5 pt-3"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#F79C79"
                    />
                }>
                {isLoading && !isRefreshing ? (
                    <View className="py-20 items-center justify-center">
                        <ActivityIndicator size="small" color="#F79C79" />
                        <Text className="text-text-secondary text-sm mt-2">
                            목록을 불러오는 중...
                        </Text>
                    </View>
                ) : (
                    <View className="pb-10">
                        {/* 🌟 목록이 비어있을 때의 Empty State 처리 */}
                        {items.length === 0 ? (
                            <View className="py-16 items-center justify-center">
                                <Text className="text-text-secondary text-base">
                                    등록된 장보기 목록이 없습니다.
                                </Text>
                                <Text className="text-text-secondary text-xs mt-1">
                                    아래 입력창에서 필요한 식재료를 추가해 보세요!
                                </Text>
                            </View>
                        ) : (
                            items.map(item => (
                                <ShoppingListItem
                                    key={item.id}
                                    item={item}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}

                        {/* 하단 밑줄 입력창 기본 배치 */}
                        <AddShoppingItem onAdd={handleAddItem} />
                        <AddShoppingItem onAdd={handleAddItem} />
                        <AddShoppingItem onAdd={handleAddItem} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
