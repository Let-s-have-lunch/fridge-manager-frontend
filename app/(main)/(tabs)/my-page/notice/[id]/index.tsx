import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import noticeApi from "@/api/user/noticeApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { Notice } from "@/types/notice";
import { Alert, Platform, Pressable, ScrollView, View, useColorScheme } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";

function UserNoticeDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const noticeId = Number(id);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 상세 정보 불러오기
    useEffect(() => {
        if (!noticeId || isNaN(noticeId)) return;

        const fetchNotice = async () => {
            try {
                setIsLoading(true);
                const data = await noticeApi.getNoticeById(noticeId);
                setNotice(data);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("공지사항을 불러오지 못했습니다.");
                    router.back();
                } else {
                    Alert.alert("오류", "공지사항을 불러오지 못했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotice().then(() => {});
    }, [noticeId, router]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-bg-paper justify-center items-center">
                <LoadingIndicator />
            </View>
        );
    }

    if (!notice) return null;

    return (
        <View className="flex-1 w-full">
            {/* 상단 타이틀 영역 (어드민과 동일) */}
            <Title
                title="공지사항"
                showBackButton={true}
                onBackPress={() => router.back()}
                className="h-auto pb-4 mb-6"
            />

            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {/* 본문 카드 박스 (어드민과 완전히 동일한 구조 및 클래스명) */}
                <View className="bg-bg-paper border border-divider rounded-2xl p-6 shadow-sm mb-6">
                    {/* 1. 최상단: 제목 라인 (굵고 큰 폰트 + 하단 보더 라인) */}
                    <View className="pb-4 mb-4 border-b border-divider">
                        <TextComponent
                            className="text-lg font-bold text-text-default"
                            numberOfLines={1}>
                            {notice.title}
                        </TextComponent>
                    </View>

                    {/* 2. 그 아래: No., 등록일 라인 (보더 없음) */}
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="flex-row items-center gap-2">
                            <TextComponent className="text-xs text-text-secondary font-medium">
                                No. {notice.id}
                            </TextComponent>
                        </View>
                        <TextComponent className="text-xs text-text-secondary">
                            등록일: {notice.createdAt ? notice.createdAt.substring(0, 10) : ""}
                        </TextComponent>
                    </View>

                    {/* 3. 내용 본문 영역 */}
                    <View className="min-h-[200px]">
                        <TextComponent className="text-text-default leading-6 whitespace-pre-wrap">
                            {notice.content}
                        </TextComponent>
                    </View>
                </View>

                {/* 하단 버튼 영역 (어드민 스타일을 유지하되 사용자용 '목록으로' 버튼 배치) */}
                <View className="flex-row justify-end gap-3 pb-6">
                    <Pressable
                        onPress={() => router.back()}
                        className="px-5 py-3 rounded-xl bg-primary-main hover:bg-primary-point active:opacity-85 transition-colors">
                        <TextComponent className="font-bold text-white text-xs">
                            목록으로
                        </TextComponent>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserNoticeDetailPage;
