import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Pagination from "@/components/common/pagination/Paginnation";
import { Badge } from "@react-navigation/elements";

function AdminInquiryListPage() {
    const router = useRouter();
    const [list, setList] = useState<InquiryUserItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;
    const [total, setTotal] = useState(0);

    const loadInquiries = useCallback(
        async (targetPage: number, targetSize: number) => {
            try {
                setIsLoading(true);
                const result = await adminInquiryApi.fetchInquiryList(targetPage, targetSize);
                setList(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("1:1 문의 목록을 불러오는데 실패했습니다.");
                } else {
                    Alert.alert("오류", "1:1 문의 목록을 불러오는데 실패했습니다.", [
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
        loadInquiries(currentPage, pageSize);
    }, [currentPage, pageSize, loadInquiries]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    return (
        <View className="flex-1 w-full">
            {/* 상단 타이틀 영역 */}
            <View className="mb-6">
                <Title
                    title="1:1 문의 관리"
                    description="사용자의 문의글을 확인하고 관리합니다."
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    className="h-auto py-1"
                />
            </View>

            {/* 테이블 컨테이너 */}
            <View className="flex-1  border border-divider rounded-2xl overflow-hidden flex flex-col">
                {/* 테이블 헤더 (웹 환경 대응) */}
                <View className="hidden md:flex flex-row items-center px-4 py-3 border-b border-divider bg-primary-main">
                    <TextComponent className="w-16 font-bold text-text-secondary text-center">
                        ID
                    </TextComponent>
                    <TextComponent className="flex-1 font-bold text-text-secondary px-4">
                        제목
                    </TextComponent>
                    <TextComponent className="w-32 font-bold text-text-secondary text-center">
                        작성일
                    </TextComponent>
                    <TextComponent className="w-28 font-bold text-text-secondary text-center">
                        작성자
                    </TextComponent>
                    <TextComponent className="w-28 font-bold text-text-secondary text-center">
                        상태
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
                                등록된 문의글이 없습니다.
                            </TextComponent>
                        </View>
                    ) : (
                        <View className="w-full pb-4 md:pb-0">
                            {list.map((item, index) => (
                                <View key={item.id} className="w-full">
                                    {/* 모바일 전용 카드형 UI */}
                                    <Pressable
                                        onPress={() => router.push(`/admin/inquiries/${item.id}`)}
                                        className="md:hidden p-4 bg-bg-paper border border-divider rounded-xl my-1.5 shadow-sm">
                                        <View className="flex-row justify-between items-center mb-2">
                                            <TextComponent className="text-xs text-text-secondary font-medium">
                                                No. {item.id} | {item.user?.nickname || "탈퇴 회원"}
                                            </TextComponent>
                                            <Badge color={item.answer ? "success" : "info"}>
                                                {item.answer ? "답변완료" : "답변대기"}
                                            </Badge>
                                        </View>
                                        <TextComponent
                                            className="font-bold text-text-default text-base mb-1"
                                            numberOfLines={1}>
                                            {item.title}
                                        </TextComponent>
                                        <TextComponent className="text-xs text-text-secondary">
                                            {item.createdAt ? item.createdAt.substring(0, 10) : ""}
                                        </TextComponent>
                                    </Pressable>

                                    {/* 웹/태블릿 전용 테이블 Row UI */}
                                    <Pressable
                                        onPress={() => router.push(`/admin/inquiries/${item.id}`)}
                                        className={twMerge(
                                            "hidden md:flex flex-row items-center px-4 py-3.5 bg-bg-paper border-b border-divider",
                                            index === list.length - 1 && "border-b-0",
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
                                        <TextComponent className="w-28 text-sm text-text-secondary text-center">
                                            {item.user?.nickname || "탈퇴 회원"}
                                        </TextComponent>
                                        <View
                                            className={twMerge(
                                                "px-2.5 py-1 rounded-full",
                                                item.answer
                                                    ? "bg-emerald-500/10"
                                                    : "bg-blue-500/10",
                                            )}>
                                            <TextComponent
                                                className={twMerge(
                                                    "text-xs font-bold",
                                                    item.answer
                                                        ? "text-emerald-600"
                                                        : "text-blue-600",
                                                )}>
                                                {item.answer ? "답변완료" : "답변대기"}
                                            </TextComponent>
                                        </View>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            </View>

            {/* 페이지네이션 컴포넌트 */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPage}
                onPageChange={(newPage: number) =>
                    router.setParams({ page: String(newPage), size: String(pageSize) })
                }
            />
        </View>
    );
}

export default AdminInquiryListPage;