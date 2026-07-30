import React, { useCallback, useState } from "react";
import { View, Platform, Alert } from "react-native";
import { useLocalSearchParams, useFocusEffect, router } from "expo-router";
import { ShoppingItem } from "@/types/shoppingList";
import shoppingListApi from "@/api/user/shoppingListApi";
import ShoppingListHistorySection from "@/components/domain/shopping/ShoppingListHistorySection";
import ShoppingListFormModal from "@/components/domain/shopping/ShoppingListFormModal";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function DailyShoppingListScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [selectedShoppingItem, setSelectedShoppingItem] = useState<ShoppingItem | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { isLoggedIn } = useAuthStore();

    const loadShoppingList = useCallback(async () => {
        if (!isLoggedIn || !date) {
            setIsLoading(false);
            return;
        }

        try {
            const result = await shoppingListApi.getShoppingItems(date);
            setShoppingList(result);
        } catch (error) {
            console.error("데이터 로드 실패 상세 원인: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [date, isLoggedIn]);

    const requireAuth = (action: () => void) => {
        if (!isLoggedIn) {
            const title = "로그인이 필요해요";
            const msg = "장보기 일정을 추가하고 관리하시려면 먼저 로그인해주세요.";

            if (Platform.OS === "web") {
                if (window.confirm(`${title}\n${msg}`)) {
                    router.push("/auth/login");
                }
            } else {
                Alert.alert(title, msg, [
                    { text: "취소", style: "cancel" },
                    { text: "로그인", onPress: () => router.push("/auth/login") },
                ]);
            }
            return;
        }
        action();
    };

    const handleOpenAddModal = () => {
        requireAuth(() => {
            setSelectedShoppingItem(null);
            setIsModalVisible(true);
        });
    };

    const handleOpenEditModal = (shoppingItem: ShoppingItem) => {
        requireAuth(() => {
            setSelectedShoppingItem(shoppingItem);
            setIsModalVisible(true);
        });
    };

    const handleDelete = (id: number) => {
        requireAuth(() => {
            const executeDelete = async () => {
                try {
                    await shoppingListApi.deleteShoppingItem(id);
                    await loadShoppingList();
                } catch (error) {
                    console.error("삭제 실패:", error);
                    if (Platform.OS === "web") {
                        alert("일정을 삭제하는 중 오류가 발생했습니다.");
                    } else {
                        Alert.alert("오류", "일정을 삭제하는 중 오류가 발생했습니다.");
                    }
                }
            };

            if (Platform.OS === "web") {
                if (window.confirm("정말 이 일정을 삭제 처리 하시겠습니까?")) {
                    void executeDelete();
                }
            } else {
                Alert.alert("경고", "정말 이 일정을 삭제 처리 하시겠습니까?", [
                    { text: "취소", style: "cancel" },
                    { text: "삭제", style: "destructive", onPress: executeDelete },
                ]);
            }
        });
    };

    const handleToggleStatus = async (id: number) => {
        requireAuth(async () => {
            try {
                await shoppingListApi.toggleShoppingTodo(id);
                await loadShoppingList();
            } catch (error) {
                console.error("상태 변경 실패:", error);
                if (Platform.OS === "web") {
                    alert("상태를 변경하는 중 오류가 발생했습니다.");
                } else {
                    Alert.alert("오류", "상태를 변경하는 중 오류가 발생했습니다.");
                }
            }
        });
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedShoppingItem(null);
    };

    useFocusEffect(
        useCallback(() => {
            void loadShoppingList();
        }, [loadShoppingList]),
    );

    return (
        <View className={twMerge("flex-1")}>
            <ShoppingListHistorySection
                targetDate={date}
                shoppingList={shoppingList}
                onAddPress={handleOpenAddModal}
                onEditPress={handleOpenEditModal}
                onDeletePress={handleDelete}
                onTogglePress={handleToggleStatus}
                isLoading={isLoading}
                isLoggedIn={isLoggedIn}
            />

            <ShoppingListFormModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                targetDate={date}
                initialData={selectedShoppingItem}
                onRefresh={loadShoppingList}
            />
        </View>
    );
}
