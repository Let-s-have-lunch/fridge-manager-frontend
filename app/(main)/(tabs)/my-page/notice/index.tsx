import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Pressable, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import noticeApi from "@/api/user/noticeApi";
import { twMerge } from "tailwind-merge";
import Pagination from "@/components/common/pagination/Paginnation";
import { Notice } from "@/types/notice";
import Badge from "@/components/common/badge/Badge"; // 🆕 뱃지 임포트

const checkIsNewNotice = (dateString: string) => {
    const today = new Date();
    const noticeDate = new Date(dateString);
    const diffTime = today.getTime() - noticeDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3; // 3일 이내면 true
};

function UserNoticePage() {
    const router = useRouter();
    const [notices, setNotices] = useState<Notice[]>([]);
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
            <Title
                title="공지사항"
                showBackButton={true}
                onBackPress={() => router.back()}
                className={"mb-6"}
            />
            {/* 👇 스크롤바 숨김 처리 적용됨 */}
            <ScrollView
                className={"flex-1"}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                <View
                    className={twMerge(
                        ["hidden", "md:flex"],
                        ["flex-row", "items-center", "px-4", "py-3"],
                        ["border-divider", "border-b", "bg-bg-subtle", "rounded-t-xl"],
                    )}>
                    <TextComponent
                        className={twMerge(
                            ["hidden", "md:flex", "w-12"],
                            ["text-[15px]"],
                            ["font-bold", "text-text-default"],
                        )}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge(
                            ["flex-1"],
                            ["text-[15px]"],
                            ["font-bold", "text-text-default", "px-2"],
                        )}>
                        제목
                    </TextComponent>

                    <TextComponent
                        className={twMerge(
                            ["w-24"],
                            ["text-[15px]"],
                            ["font-bold", "text-text-default", "text-center"],
                        )}>
                        등록일
                    </TextComponent>
                </View>

                {isLoading ? (
                    <View className="py-20 justify-center items-center">
                        <LoadingIndicator />
                    </View>
                ) : notices.length === 0 ? (
                    <View className="py-40 justify-center items-center">
                        <TextComponent className="text-text-secondary">
                            등록된 공지사항이 없습니다.
                        </TextComponent>
                    </View>
                ) : (
                    notices.map((item, index) => {
                        const isNew = checkIsNewNotice(item.createdAt); // 🆕 [추가] 3일 이내 판별

                        return (
                            <View
                                key={item.id}
                                className={twMerge(
                                    [
                                        "my-2",
                                        "md:my-0",
                                        "flex-col",
                                        "md:flex-row",
                                        "md:items-center",
                                        "px-4",
                                        "py-4",
                                        "md:py-3",
                                        "bg-bg-paper",
                                        "rounded-xl",
                                        "md:rounded-none",
                                    ],
                                    index === notices.length - 1 && [
                                        "md:rounded-b-xl",
                                    ],
                                )}
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.08,
                                    shadowRadius: 6,
                                    elevation: 3,
                                }}>
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
                                    {/* 🆕 [추가] 모바일 전용 뱃지 (제목 위쪽 배치) */}
                                    {isNew && (
                                        // 👇 self-start 클래스를 추가하여 가로로 꽉 차는 현상을 막아줍니다!
                                        <View className="mb-1.5 md:hidden self-start">
                                            <Badge>NEW</Badge>
                                        </View>
                                    )}

                                    <View className="flex-row items-center gap-2">
                                        <TextComponent
                                            className={twMerge([
                                                "font-semibold",
                                                "transition-all",
                                                "hover:text-primary-main",
                                                "text-[14px] md:text-base", // 🛠️ [수정] 모바일에서 제목 크기 조절
                                            ])}
                                            numberOfLines={1}>
                                            {item.title}
                                        </TextComponent>

                                        {/* 🆕 [추가] 데스크탑 전용 뱃지 (제목 옆 배치) */}
                                        {isNew && (
                                            <View className="hidden md:flex">
                                                <Badge color="primary" size="small">
                                                    NEW
                                                </Badge>
                                            </View>
                                        )}
                                    </View>

                                    {/* 🛠️ [추가] 본문 미리보기 (모바일: 2줄) */}
                                    <TextComponent
                                        className="text-sm text-text-secondary mt-1.5 md:hidden"
                                        numberOfLines={2}>
                                        {item.content || "본문 내용이 없습니다."}
                                    </TextComponent>

                                    {/* 🛠️ [추가] 본문 미리보기 (데스크탑: 1줄) */}
                                    <TextComponent
                                        className="text-sm text-text-secondary mt-1 hidden md:flex"
                                        numberOfLines={1}>
                                        {item.content || "본문 내용이 없습니다."}
                                    </TextComponent>

                                    {/* 🛠️ [추가] 작성일 (모바일: 본문 아래 배치) */}
                                    <TextComponent className="text-[11px] text-text-subtle mt-2.5 md:hidden">
                                        {item.createdAt.substring(0, 10).replace(/-/g, ".")}
                                    </TextComponent>
                                </Pressable>

                                {/* 🛠️ [수정] 작성일 (데스크탑: 우측 고정, 텍스트 크기 text-xs 로 축소) */}
                                <TextComponent
                                    className={twMerge("w-24", [
                                        "text-xs", // 👈 기존 text-sm 에서 변경
                                        "text-text-secondary",
                                        "text-center",
                                        "hidden",
                                        "md:flex", // 데스크탑에서만 렌더링
                                    ])}>
                                    {item.createdAt.substring(0, 10).replace(/-/g, ".")}
                                </TextComponent>
                            </View>
                        );
                    })
                )}
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
