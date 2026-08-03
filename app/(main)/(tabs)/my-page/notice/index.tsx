import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import noticeApi, { NoticeItem } from "@/api/user/noticeApi";
import { twMerge } from "tailwind-merge";
import Pagination from "@/components/common/pagination/Paginnation";

function UserNoticePage() {
    const router = useRouter();
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const loadNotices = useCallback(
        async (targetPage: number, targetSize: number) => {
            try {
                const result = await noticeApi.getNoticeList(targetPage, targetSize);
                setNotices(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("공지사항 목록을 불러오는데 실패했습니다.");
                } else {
                    Alert.alert("오류", "공지사항 목록을 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [router],
    );

    useEffect(() => {
        loadNotices(currentPage, pageSize).then(() => {});
    }, [currentPage, loadNotices, pageSize]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <View className={"flex-1"}>
            <Title title="공지사항" showBackButton={true} onBackPress={() => router.back()} />
            <ScrollView className={"flex-1"}>
                <View
                    className={twMerge(
                        ["hidden", "md:flex"],
                        ["flex-row", "items-center", "px-4", "py-3"],
                        [
                            "border-divider",
                            "border-b",
                            "bg-primary-main",
                            "bg-background-light",
                            "rounded-t-xl",
                        ],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-12"],
                            ["font-bold", "text-text-secondary"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["font-bold", "text-text-secondary", "px-2"],
                        )}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["font-bold", "text-text-secondary", "text-center"],
                        )}>
                        등록일
                    </TextComponent>
                </View>
                {isLoading && (
                    <View className={"py-20"}>
                        <LoadingIndicator />
                    </View>
                )}
                {notices.length === 0 && (
                    <View className={twMerge("py-20", "justify-center", "items-center")}>
                        <TextComponent className={"text-text-secondary"}>
                            등록된 공지사항이 없습니다.
                        </TextComponent>
                    </View>
                )}
                {notices.map((item, index) => (
                    <View
                        key={item.id}
                        className={twMerge(
                            ["my-1", "md:my-0"],
                            ["flex-col", "md:flex-row", "md:items-center", "px-4", "py-3"],
                            [
                                "transition-all",
                                "bg-background-paper",
                                "border-b",
                                "border-background-default",
                                "hover:bg-background-light",
                                "rounded-xl",
                                "md:rounded-none",
                            ],
                            index === notices.length - 1 && ["md:rounded-b-xl", "border-b-0"],
                        )}>
                        <TextComponent
                            className={twMerge(
                                ["hidden", "md:flex", "w-12"],
                                ["text-center", "text-text-secondary"],
                            )}>
                            {item.id}
                        </TextComponent>
                        <Pressable
                            className={twMerge("flex-1", "justify-center", "px-2")}
                            onPress={() => router.push(`/my-page/notice/${item.id}`)}>
                            <TextComponent
                                className={twMerge([
                                    "font-bold",
                                    "transition-all",
                                    "hover:text-primary-main",
                                    ["pb-2", "md:pb-0"],
                                ])}
                                numberOfLines={1}>
                                {item.title}
                            </TextComponent>
                        </Pressable>
                        <TextComponent
                            className={twMerge("w-24", [
                                "text-sm",
                                "text-text-secondary",
                                "text-center",
                            ])}>
                            {item.createdAt.substring(0, 10)}
                        </TextComponent>
                    </View>
                ))}
            </ScrollView>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={newPage =>
                    router.setParams({ page: String(newPage), size: String(pageSize) })
                }
            />
        </View>
    );
}

export default UserNoticePage;
