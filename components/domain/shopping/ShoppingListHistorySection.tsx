import { ShoppingItem } from "@/types/shoppingList";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Title from "@/components/common/title/Title";
import React, { useMemo } from "react";
import { useRouter } from "expo-router";
import Card from "@/components/common/card/Card";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/button/Button";
import { Feather } from "@expo/vector-icons";

interface Props {
    targetDate: string;
    shoppingList: ShoppingItem[];
    onAddPress: () => void;
    onEditPress: (shoppingItem: ShoppingItem) => void;
    onDeletePress: (id: number) => void;
    onTogglePress: (id: number) => void;
}

export default function ShoppingListHistorySection({
    targetDate,
    shoppingList,
    onAddPress,
    onEditPress,
    onDeletePress,
    onTogglePress,
}: Props) {
    const router = useRouter();

    const formattedDate = useMemo(() => {
        if (!targetDate) return "";
        const [year, month, day] = targetDate.split("-").map(Number);
        return `${year}년 ${month}월 ${day}일`;
    }, [targetDate]);

    return (
        <View
            className={twMerge(
                ["flex-1 w-full max-w-[600px]"],
                ["self-center"],
                ["relative"],
            )}>
            <Title
                title={`${formattedDate}`}
                showBackButton={true}
                onBackPress={() => router.back()}
            />
            <ScrollView
                className={twMerge(["relative"], ["mt-4"])}
                showsVerticalScrollIndicator={false}>
                <Card className={twMerge(["relative"], ["mt-6"])}>
                    {/* 🎀 상단 마스킹 테이프 장식 (CSS 연출) */}
                    <View
                        className={twMerge(
                            ["absolute -top-3 self-center z-10"],
                            ["w-16 h-7"],
                            ["-rotate-12 opacity-90 shadow-sm"],
                        )}
                        style={{ backgroundColor: "#F4E3C5", borderRadius: 2 }}
                    />
                    {/* 타이틀 영역 */}
                    <View
                        className={twMerge(
                            ["flex-row items-center justify-center w-full"],
                            ["relative"],
                            ["mt-3 mb-8"],
                        )}>
                        <TextComponent
                            className={twMerge(
                                ["text-2xl font-bold tracking-wide"],
                            )}>
                            장보기 리스트
                        </TextComponent>
                    </View>
                    {/* 3. 리스트 영역 */}
                    <View className={twMerge(["gap-3"], ["pt-2"])}>
                        {shoppingList.length > 0 ? (
                            shoppingList.map(shoppingItem => {
                                const isChecked = shoppingItem.isChecked;

                                return (
                                    <Card
                                        key={shoppingItem.id}
                                        className={twMerge(
                                            ["flex-row items-center"],
                                            ["p-4 gap-4"],
                                            ["elevation-1"],
                                        )}>
                                        <Button
                                            variant={"icon-only"}
                                            className="mr-1"
                                            onPress={() => onTogglePress(shoppingItem.id)}>
                                            {isChecked ? (
                                                <Feather
                                                    name="check-square"
                                                    size={22}
                                                    color="#EF7D6D"
                                                />
                                            ) : (
                                                <Feather name="square" size={22} color="#F79C79" />
                                            )}
                                        </Button>

                                        <View className="flex-1">
                                            <TextComponent
                                                className={twMerge(
                                                    ["font-semibold text-[15px]"],
                                                    ["mb-1"],
                                                    isChecked
                                                        ? ["text-text-secondary line-through"]
                                                        : ["text-text-default"],
                                                )}>
                                                {shoppingItem.memo}
                                            </TextComponent>
                                        </View>

                                        <View
                                            className={twMerge(
                                                ["flex-row items-center"],
                                                ["ml-2"],
                                            )}>
                                            {!isChecked && (
                                                <Button
                                                    variant={"icon-only"}
                                                    className="mr-1"
                                                    onPress={() => onEditPress(shoppingItem)}>
                                                    <Feather
                                                        name="edit-2"
                                                        size={16}
                                                        color="#444444"
                                                    />
                                                </Button>
                                            )}
                                            <Button
                                                variant={"icon-only"}
                                                onPress={() => onDeletePress(shoppingItem.id)}>
                                                <Feather name="trash-2" size={16} color="#444444" />
                                            </Button>
                                        </View>
                                    </Card>
                                );
                            })
                        ) : (
                            <Card
                                className={twMerge(
                                    ["py-6"],
                                    ["text-center text-sm text-text-secondary"],
                                )}>
                                <TextComponent>등록된 일정이 없습니다.</TextComponent>
                            </Card>
                        )}
                    </View>
                </Card>
            </ScrollView>

            <Button
                variant={"contained-circle"}
                onPress={onAddPress}
                className={twMerge(
                    ["absolute z-50"],
                    ["right-6 bottom-6", "md:right-8 md:bottom-8"],
                    ["elevation-4"],
                )}>
                <Feather name={"plus"} size={24} color="#FFFFFF" />
            </Button>
        </View>
    );
}
