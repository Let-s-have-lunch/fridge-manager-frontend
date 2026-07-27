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
import { useRouter, useLocalSearchParams } from "expo-router";

import { ShoppingItem } from "../../../../types/shoppingList";
import * as api from "../../../../api/shoppingListApi";
import { ShoppingListItem } from "../../../../components/shoppingList/ShoppingListItem";
import { AddShoppingItem } from "../../../../components/shoppingList/AddShoppingItem";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

const USER_ID = 1;

const MaskingTape = () => (
    <View className="items-center z-10 -mb-4" style={{ transform: [{ rotate: "-40deg" }] }}>
        <View className="flex-row items-center opacity-85">
            <View className="justify-between h-[24px] py-[1px]">
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-l-full border-l border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-l-full border-l border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-l-full border-l border-y border-[#F5D3B8]" />
            </View>
            <View
                style={{
                    width: 40,
                    height: 24,
                    backgroundColor: "#FDE8D8",
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#F5D3B8",
                }}
            />
            <View className="justify-between h-[24px] py-[1px]">
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-r-full border-r border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-r-full border-r border-y border-[#F5D3B8]" />
                <View className="w-[5px] h-[6px] bg-[#FDE8D8] rounded-r-full border-r border-y border-[#F5D3B8]" />
            </View>
        </View>
    </View>
);

export default function ShoppingTodoListScreen() {
    const router = useRouter();
    const { date } = useLocalSearchParams<{ date?: string }>();
    const selectedDate = date || "2026-07-23";

    const [items, setItems] = useState<ShoppingItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const fetchItems = useCallback(async (dateString: string, isRefresh = false) => {
        try {
            if (!isRefresh) setIsLoading(true);
            const data = await api.getShoppingItems(USER_ID, dateString);
            setItems(data);
        } catch (error) {
            setItems([
                { id: 1, memo: "오이오이", date: "26.07.08 pm 08:59", isChecked: false },
                { id: 2, memo: "L오L오2O", date: "26.07.08 am 05:06", isChecked: false },
            ]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (selectedDate) {
            fetchItems(selectedDate);
        }
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
        } catch (e) {
            fetchItems(selectedDate);
        }
    };

    const handleAddItem = async (memo: string) => {
        try {
            const newItem = await api.createShoppingItem(USER_ID, { memo, date: selectedDate });
            setItems(prev => [...prev, newItem]);
        } catch (error) {
            setItems(prev => [
                ...prev,
                { id: Date.now(), memo, date: selectedDate, isChecked: false },
            ]);
        }
    };

    const handleUpdate = async (itemId: number, newMemo: string) => {
        setItems(prev =>
            prev.map(item => (item.id === itemId ? { ...item, memo: newMemo } : item)),
        );
        try {
            await api.updateShoppingItem(USER_ID, itemId, { memo: newMemo, date: selectedDate });
        } catch (e) {
            fetchItems(selectedDate);
        }
    };

    const handleDelete = async (itemId: number) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
        try {
            await api.deleteShoppingItem(USER_ID, itemId);
        } catch (e) {}
    };

    return (
        <SafeAreaView className="flex-1 bg-white items-center justify-center">
            <View className="w-full max-w-[400px] flex-1 bg-white flex-col justify-between shadow-sm">
                <View className="flex-row items-center px-6 py-4 bg-white">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mr-3 p-1"
                        activeOpacity={0.7}>
                        <Text className="text-[#2B2623] text-xl font-bold">←</Text>
                    </TouchableOpacity>
                    <Text className="text-lg font-bold text-[#2B2623]">
                        {selectedDate} 할일 등록
                    </Text>
                </View>

                <ScrollView
                    className="flex-1 px-6 pt-4"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={handleRefresh}
                            tintColor="#FF5C46"
                        />
                    }>
                    <MaskingTape />

                    <View className="bg-[#FFFDF9] rounded-[32px] px-6 py-8 shadow-sm border border-[#EBE5DD] mb-10">
                        <Text className="text-2xl font-black text-[#2B2623] text-center mb-6 tracking-tight">
                            할일 등록
                        </Text>

                        {isLoading && !isRefreshing ? (
                            <View className="py-12 items-center justify-center">
                                <ActivityIndicator size="small" color="#FF5C46" />
                            </View>
                        ) : (
                            <View>
                                {items.map(item => (
                                    <ShoppingListItem
                                        key={item.id}
                                        item={item}
                                        onToggle={handleToggle}
                                        onDelete={handleDelete}
                                        onUpdate={handleUpdate}
                                    />
                                ))}

                                <AddShoppingItem onAdd={handleAddItem} />
                            </View>
                        )}
                    </View>
                </ScrollView>

                <View className="flex-row justify-around items-center py-3 bg-white border-t border-[#F0EBE3] w-full">
                    <TouchableOpacity className="items-center" activeOpacity={0.7}>
                        <AntDesign name="home" size={24} color="#666666" />
                        <Text className="text-xs text-[#666666] mt-1 font-bold">홈</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center" activeOpacity={0.7}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={26}
                            color="#FF5C46"
                        />
                        <Text className="text-xs text-[#FF5C46] font-bold mt-1">목록</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center" activeOpacity={0.7}>
                        <AntDesign name="bar-chart" size={24} color="#666666" />
                        <Text className="text-xs text-[#666666] mt-1 font-bold">통계</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
