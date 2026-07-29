import React, { useCallback, useState } from "react";
import { View, Platform, Alert } from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { ShoppingItem } from "@/types/shoppingList";
import shoppingListApi from "@/api/user/shoppingListApi";
import ShoppingListHistorySection from "@/components/domain/shopping/ShoppingListHistorySection";
import ShoppingListFormModal from "@/components/domain/shopping/ShoppingListFormModal";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

export default function DailyShoppingListScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
    const [selectedShoppingItem, setSelectedShoppingItem] = useState<ShoppingItem | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const loadShoppingList = useCallback(async () => {
        if (!date) return;
        setIsLoading(true);

        try {
            const result = await shoppingListApi.getShoppingItems(date);
            setShoppingList(result);
        } catch (error) {
            console.error("데이터 로드 실패 상세 원인: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [date]);

    const handleOpenAddModal = () => {
        setSelectedShoppingItem(null);
        setIsModalVisible(true);
    };

    const handleOpenEditModal = (shoppingItem: ShoppingItem) => {
        setSelectedShoppingItem(shoppingItem);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedShoppingItem(null);
    };

    const handleDelete = (id: number) => {
        const executeDelete = async () => {
            try {
                await shoppingListApi.deleteShoppingItem(id);
                await loadShoppingList();
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("일정을 삭제하는 중 오류가 발생했습니다.");
                } else {
                    Alert.alert("오류", "일정을 삭제하는 중 오류가 발생했습니다.");
                }
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 이 일정을 삭제 처리 하시겠습니까?")) {
                executeDelete().then(() => {});
            }
        } else {
            Alert.alert("경고", "정말 이 일정을 삭제 처리 하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: executeDelete },
            ]);
        }
    };

    const handleToggleStatus = async (id: number) => {
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
    };

    useFocusEffect(
        useCallback(() => {
            void loadShoppingList();
        }, [loadShoppingList]),
    );

    return (
        <View className="flex-1">
            <ShoppingListHistorySection
                targetDate={date}
                shoppingList={shoppingList}
                onAddPress={handleOpenAddModal}
                onEditPress={handleOpenEditModal}
                onDeletePress={handleDelete}
                onTogglePress={handleToggleStatus}
            />
            <ShoppingListFormModal
                visible={isModalVisible}
                onClose={handleCloseModal}
                targetDate={date}
                initialData={selectedShoppingItem}
                onRefresh={loadShoppingList}
            />

            {isLoading && <LoadingIndicator fullScreen={true} />}
        </View>
    );
}
