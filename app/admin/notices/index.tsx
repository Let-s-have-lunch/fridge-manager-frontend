import { useCallback, useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import adminApi from "@/api/admin/adminApi";
import { twMerge } from "tailwind-merge";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { AdminNotice } from "@/types/admin";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import Pagination from "@/components/common/pagination/Paginnation";
import Title from "@/components/common/title/Title"; // ✅ Title 컴포넌트 임포트 경로 확인

function AdminNoticeListPage() {
    const [list, setList] = useState<AdminNotice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const router = useRouter();

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const loadNotices = useCallback(
        async (targetPage: number, targetSize: number) => {
            try {
                setIsLoading(true);
                const result = await adminApi.getNoticeList(targetPage, targetSize);
                setList(result.list);
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
        loadNotices(currentPage, pageSize);
    }, [currentPage, loadNotices, pageSize]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    return (
        <View className="flex-1 w-full">
            {/* 상단 Title 컴포넌트 및 공지 등록 버튼 영역 */}
            <Title
                title="공지사항 관리"
                description="등록된 공지사항 목록을 확인하고 관리합니다."
                className="h-auto pb-4 mb-6">
                <Pressable
                    onPress={() => router.push("/admin/notices/create")}
                    className="bg-primary-main px-4 py-2.5 rounded-xl items-center shrink-0">
                    <TextComponent className="font-bold text-white">공지 등록</TextComponent>
                </Pressable>
            </Title>

            {/* 웹 전용 테이블 헤더 */}
            <View className="hidden md:flex flex-row items-center px-4 py-3 border-b border-divider bg-primary-main rounded-t-xl">
                <TextComponent className="w-16 font-bold text-text-secondary text-center">
                    ID
                </TextComponent>
                <TextComponent className="flex-1 font-bold text-text-secondary px-4">
                    제목
                </TextComponent>
                <TextComponent className="w-32 font-bold text-text-secondary text-center">
                    등록일
                </TextComponent>
            </View>

            {/* 본문 리스트 영역 */}
            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View className="py-20 justify-center items-center">
                        <LoadingIndicator />
                    </View>
                ) : list.length === 0 ? (
                    <View className="py-20 justify-center items-center">
                        <TextComponent className="text-text-secondary">
                            등록된 공지사항이 없습니다.
                        </TextComponent>
                    </View>
                ) : (
                    <View className="w-full pb-4">
                        {list.map((item, index) => (
                            <View key={item.id} className="w-full">
                                {/* 모바일 전용 카드형 UI */}
                                <Pressable
                                    onPress={() => router.push(`/admin/notices/${item.id}`)}
                                    className="md:hidden p-4 bg-bg-paper border border-divider rounded-xl my-1.5 shadow-sm">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <TextComponent className="text-xs text-text-secondary font-medium">
                                            No. {item.id}
                                        </TextComponent>
                                        <TextComponent className="text-xs text-text-secondary">
                                            {item.createdAt ? item.createdAt.substring(0, 10) : ""}
                                        </TextComponent>
                                    </View>
                                    <TextComponent
                                        className="font-bold text-text-default text-base"
                                        numberOfLines={1}>
                                        {item.title}
                                    </TextComponent>
                                </Pressable>

                                {/* 웹/태블릿 전용 테이블 Row UI */}
                                <Pressable
                                    onPress={() => router.push(`/admin/notices/${item.id}`)}
                                    className={twMerge(
                                        "hidden md:flex flex-row items-center px-4 py-3.5 bg-bg-paper border-x border-b border-divider",
                                        index === list.length - 1 && "rounded-b-xl",
                                    )}>
                                    <TextComponent className="w-16 text-center text-text-secondary">
                                        {item.id}
                                    </TextComponent>
                                    <TextComponent
                                        className="flex-1 font-bold text-text-default px-4"
                                        numberOfLines={1}>
                                        {item.title}
                                    </TextComponent>
                                    <TextComponent className="w-32 text-sm text-text-secondary text-center">
                                        {item.createdAt ? item.createdAt.substring(0, 10) : ""}
                                    </TextComponent>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* 페이지네이션 컴포넌트 연동 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage: number) =>
                    router.setParams({ page: String(newPage), size: String(pageSize) })
                }
            />
        </View>
    );
}

export default AdminNoticeListPage;
