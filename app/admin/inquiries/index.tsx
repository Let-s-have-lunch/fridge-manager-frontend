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
import ExpireBadge from "@/components/common/badge/Badge";

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
            <Title
                title="1:1 문의 관리"
                description={`사용자의 문의글을 확인하고 관리합니다. (총 ${total}건)`}
                className="h-auto pb-4 mb-6"
            />

            {/* 테이블 헤더 (웹 환경 대응) */}
            <View className="hidden md:flex flex-row items-center px-4 py-3 border border-divider border-b-0 bg-primary-main rounded-t-xl">
                <TextComponent className="w-16 font-bold text-primary-contrast text-center">
                    ID
                </TextComponent>
                <TextComponent className="flex-1 font-bold text-primary-contrast px-4">
                    제목
                </TextComponent>
                <TextComponent className="w-32 font-bold text-primary-contrast text-center">
                    작성일
                </TextComponent>
                <TextComponent className="w-28 font-bold text-primary-contrast text-center">
                    작성자
                </TextComponent>
                <TextComponent className="w-28 font-bold text-primary-contrast text-center">
                    상태
                </TextComponent>
            </View>

            {/* 본문 리스트 영역 */}
            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View className="py-20 justify-center items-center border border-divider border-t-0 bg-bg-paper rounded-b-xl">
                        <LoadingIndicator />
                    </View>
                ) : list.length === 0 ? (
                    <View className="py-20 justify-center items-center border border-divider border-t-0 bg-bg-paper rounded-b-xl">
                        <TextComponent className="text-text-secondary">
                            등록된 문의글이 없습니다.
                        </TextComponent>
                    </View>
                ) : (
                    <View className="w-full pb-4 md:pb-0">
                        {list.map((item, index) => (
                            <View key={item.id} className="w-full">
                                {/* 📱 모바일 전용 카드형 UI */}
                                <Pressable
                                    onPress={() => router.push(`/admin/inquiries/${item.id}`)}
                                    className="md:hidden p-4 bg-bg-paper border border-divider rounded-xl my-1.5 shadow-sm active:opacity-70 transition-colors">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <TextComponent className="text-xs text-text-secondary font-medium">
                                            No. {item.id} | {item.user?.nickname || "탈퇴 회원"}
                                        </TextComponent>

                                        {/* 👉 ExpireBadge 컴포넌트 적용 (모바일 뷰) */}
                                        <ExpireBadge
                                            status={item.answer ? "safe" : "warning"}
                                            className="px-2 py-0.5 rounded-md"
                                            textClasses="text-[10px]">
                                            {item.answer ? "답변완료" : "답변대기"}
                                        </ExpireBadge>
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

                                {/* 💻 웹/태블릿 전용 테이블 Row UI */}
                                <Pressable
                                    onPress={() => router.push(`/admin/inquiries/${item.id}`)}
                                    className={twMerge(
                                        "hidden md:flex flex-row items-center px-4 py-3.5 bg-bg-paper border-x border-b border-divider transition-colors duration-200",
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
                                    <TextComponent className="w-28 text-sm text-text-secondary text-center">
                                        {item.user?.nickname || "탈퇴 회원"}
                                    </TextComponent>

                                    <View className="w-28 items-center">
                                        <ExpireBadge
                                            status={item.answer ? "safe" : "warning"}
                                            className="px-2.5 py-1"
                                            textClasses="text-[10px]">
                                            {item.answer ? "답변완료" : "답변대기"}
                                        </ExpireBadge>
                                    </View>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* 페이지네이션 컴포넌트 */}
            <View className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={(newPage: number) =>
                        router.setParams({ page: String(newPage), size: String(pageSize) })
                    }
                />
            </View>
        </View>
    );
}

export default AdminInquiryListPage;
