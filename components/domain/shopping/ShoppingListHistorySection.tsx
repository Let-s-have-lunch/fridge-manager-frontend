import { ShoppingItem } from "@/types/shoppingList";
import { ScrollView, View, Pressable, Text } from "react-native";
import Title from "@/components/common/title/Title";
import React, { useMemo } from "react";
import { useRouter } from "expo-router";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/button/Button";
import { Feather, Ionicons } from "@expo/vector-icons";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

interface Props {
    targetDate: string;
    shoppingList: ShoppingItem[];
    onAddPress: () => void;
    onEditPress: (shoppingItem: ShoppingItem) => void;
    onDeletePress: (id: number) => void;
    onTogglePress: (id: number) => void;
    isLoading: boolean;
    isLoggedIn: boolean;
}

export default function ShoppingListHistorySection({
    targetDate,
    shoppingList,
    onAddPress,
    onEditPress,
    onDeletePress,
    onTogglePress,
    isLoading,
    isLoggedIn,
}: Props) {
    const router = useRouter();

    const formattedDate = useMemo(() => {
        if (!targetDate) return "";

        const [year, month, day] = targetDate.split("-").map(Number);

        return `${year}년 ${month}월 ${day}일`;
    }, [targetDate]);

    return (
        <View className={twMerge("flex-1 w-full max-w-[600px] self-center relative")}>
            <Title title={formattedDate} showBackButton={true} onBackPress={() => router.back()} />

            <ScrollView
                className="relative mt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 120,
                }}>
                {/* 장보기 리스트 전체 카드 */}
                <Card className="relative mt-6">
                    {/* 마스킹 테이프 */}
                    <View
                        className={twMerge(
                            "absolute -top-3 self-center z-10 w-16 h-7 -rotate-12 opacity-90 shadow-sm rounded-[2px]",
                            "bg-[#F4E3C5] dark:bg-bg-subtle",
                        )}
                    />

                    {/* 제목 */}
                    <View
                        className={twMerge(
                            "flex-row items-center justify-center w-full relative mt-3 mb-6",
                        )}>
                        <TextComponent className="text-[20px] text-text-default font-bold tracking-wide">
                            장보기 리스트
                        </TextComponent>
                    </View>

                    {/* 로딩 */}
                    {isLoading ? (
                        <View className="py-10 items-center justify-center">
                            <LoadingIndicator fullScreen={false} />
                        </View>
                    ) : !isLoggedIn ? (
                        <Card className="py-6 items-center">
                            <TextComponent className="text-sm text-text-secondary">
                                로그인하고 나만의 장보기 일정을 스마트하게 관리해보세요!
                            </TextComponent>
                        </Card>
                    ) : shoppingList.length > 0 ? (
                        /*
                         * 리스트
                         * 각각의 Card를 제거하고 하나의 리스트처럼 연결
                         */
                        <View className="mt-1">
                            {shoppingList.map((shoppingItem, index) => {
                                const isChecked = shoppingItem.isChecked;

                                const isLast = index === shoppingList.length - 1;

                                return (
                                    <View
                                        key={shoppingItem.id}
                                        className={twMerge(
                                            "flex-row items-center min-h-[64px] py-2",
                                            !isLast && "border-b border-divider",
                                        )}>
                                        {/* 체크 버튼 */}
                                        <Button
                                            variant="icon-only"
                                            className="mr-3"
                                            onPress={() => onTogglePress(shoppingItem.id)}>
                                            {isChecked ? (
                                                <Feather
                                                    name="check-square"
                                                    size={22}
                                                    color="#F79C79"
                                                />
                                            ) : (
                                                <Feather name="square" size={22} color="#F79C79" />
                                            )}
                                        </Button>

                                        {/* 제품명 */}
                                        <View className="flex-1">
                                            <TextComponent
                                                className={twMerge(
                                                    "text-[16px] font-semibold",
                                                    isChecked
                                                        ? "text-text-secondary line-through"
                                                        : "text-text-default",
                                                )}>
                                                {shoppingItem.memo}
                                            </TextComponent>
                                        </View>

                                        {/* 수정 / 삭제 */}
                                        <View className="flex-row items-center ml-2">
                                            {!isChecked && (
                                                <Button
                                                    variant="icon-only"
                                                    className="mr-1"
                                                    onPress={() => onEditPress(shoppingItem)}>
                                                    <Feather
                                                        name="edit-2"
                                                        size={18}
                                                        className="text-text-secondary"
                                                    />
                                                </Button>
                                            )}

                                            <Button
                                                variant="icon-only"
                                                onPress={() => onDeletePress(shoppingItem.id)}>
                                                <Feather
                                                    name="trash-2"
                                                    size={18}
                                                    className="text-text-secondary"
                                                />
                                            </Button>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <View className="py-10 items-center">
                            <TextComponent className="text-sm text-text-secondary">
                                등록된 일정이 없습니다.
                            </TextComponent>
                        </View>
                    )}
                </Card>
            </ScrollView>

            {/* 추가 버튼 */}
            <Pressable
                onPress={isLoading ? undefined : onAddPress}
                disabled={isLoading}
                className={twMerge(
                    "absolute bottom-6 right-1 h-16 w-16 items-center justify-center rounded-full bg-primary-main",
                    isLoading && "opacity-50",
                )}
                style={{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 4,
                    },
                    shadowOpacity: 0.18,
                    shadowRadius: 8,
                    elevation: 8,
                }}>
                <Ionicons name="add" size={43} color="white" />
            </Pressable>
        </View>
    );
}
