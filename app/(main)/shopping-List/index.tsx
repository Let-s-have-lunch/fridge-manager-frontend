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
import { ShoppingListItem } from "../../../components/shoppingList/ShoppingListItem";
import { AddShoppingItem } from "../../../components/shoppingList/AddShoppingItem";
import { Feather } from "@expo/vector-icons";

const USER_ID = 1;

export default function ShoppingListScreen() {
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<string>("2026-07-23");
    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchItems = useCallback(async (dateString: string, isRefresh = false) => {
        try {
            if (!isRefresh) setIsLoading(true);
            const data = await api.getShoppingItems(USER_ID, dateString);
            setItems(data);
        } catch (error) {
            console.error("목록 불러오기 실패:", error);
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

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchItems(selectedDate, true);
    };

    const handleToggle = async (itemId: number) => {
        setItems(prev =>
            prev.map(item => (item.id === itemId ? { ...item, isChecked: !item.isChecked } : item)),
        );
        try {
            await api.toggleShoppingTodo(USER_ID, itemId);
        } catch (error) {
            alert("상태 변경에 실패했습니다.");
            fetchItems(selectedDate);
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
        <SafeAreaView className="flex-1 bg-background-default">
            {/* 상단 타이틀 헤더 */}
            <View className="flex-row items-center px-6 py-3 bg-background-default">
                <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
                    <Text className="text-text-secondary text-lg font-bold">←</Text>
                </TouchableOpacity>
                <Text className="text-lg font-bold text-text">장보기 리스트</Text>
            </View>

            {/* 메인 콘텐츠 영역 (메모지 카드 디자인) */}
            <ScrollView
                className="flex-1 px-5 pt-4"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#F79C79"
                    />
                }>
                {/* 📌 상단 고정 테이프 그래픽 */}
                <View className="items-center z-10 -mb-2">
                    <View className="w-16 h-5 bg-[#EFECE6] rounded-sm opacity-80 border border-[#E2DDD5]" />
                </View>

                {/* 📝 메모지 카드 박스 */}
                <View className="bg-background-paper rounded-3xl p-6 shadow-sm border border-divider mb-8">
                    {/* 카드 내부 타이틀 */}
                    <Text className="text-xl font-bold text-text text-center mb-6">
                        장보기 리스트
                    </Text>

                    {isLoading && !isRefreshing ? (
                        <View className="py-12 items-center justify-center">
                            <ActivityIndicator size="small" color="#F79C79" />
                            <Text className="text-text-secondary text-sm mt-2">불러오는 중...</Text>
                        </View>
                    ) : (
                        <View>
                            {items.length === 0 ? (
                                <View className="py-10 items-center justify-center">
                                    <Text className="text-text-secondary text-sm">
                                        등록된 장보기 목록이 없습니다.
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

                            {/* 하단 입력창들 */}
                            <AddShoppingItem onAdd={handleAddItem} />
                            <AddShoppingItem onAdd={handleAddItem} />
                            <AddShoppingItem onAdd={handleAddItem} />
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* 🧭 하단 네비게이션 바 (홈 / 목록 / 통계) */}
            <View className="flex-row justify-around items-center py-3 bg-background-paper border-t border-divider">
                <TouchableOpacity className="items-center">
                    <Feather name="home" size={22} color="#8C827A" />
                    <Text className="text-xs text-text-secondary mt-1">홈</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <Feather name="file-text" size={22} color="#F79C79" />
                    <Text className="text-xs text-primary-main font-bold mt-1">목록</Text>
                </TouchableOpacity>

                <TouchableOpacity className="items-center">
                    <Feather name="bar-chart-2" size={22} color="#8C827A" />
                    <Text className="text-xs text-text-secondary mt-1">통계</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
