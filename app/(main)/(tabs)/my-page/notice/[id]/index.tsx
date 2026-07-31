import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import noticeApi from "@/api/user/noticeApi";
import { NoticeDetailType } from "@/api/user/inquiryApi";

function UserNoticeDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const noticeId = Number(id);

    const [notice, setNotice] = useState<NoticeDetailType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadDetail = useCallback(async () => {
        if (!noticeId || isNaN(noticeId)) return;
        try {
            setIsLoading(true);
            setErrorMessage(null);
            const data = await noticeApi.fetchNoticeDetail(noticeId);
            setNotice(data);
        } catch (error: any) {
            console.log("공지사항 상세 조회 에러:", error);
            setErrorMessage("공지사항을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [noticeId]);

    useEffect(() => {
        loadDetail().then(() => {})
    }, [loadDetail]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-bg-paper p-6 justify-center items-center">
                <LoadingIndicator />
            </View>
        );
    }

    if (errorMessage || !notice) {
        return (
            <View className="flex-1 bg-bg-paper p-6 justify-center items-center">
                <TextComponent className="text-text-secondary text-base mb-4">
                    {errorMessage || "존재하지 않는 공지사항입니다."}
                </TextComponent>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-bg-paper">
            <ScrollView className="flex-1 p-4 md:p-6 w-full" showsVerticalScrollIndicator={false}>
                <View className="mb-6">
                    <Title
                        title="공지사항 상세"
                        description="공지 내용을 상세히 확인합니다."
                        showBackButton={true}
                        onBackPress={() => router.back()}
                        className="h-auto py-1"
                    />
                </View>

                <View className="bg-bg-subtle/30 border border-divider rounded-2xl p-5 mb-6">
                    <TextComponent className="text-xs text-text-secondary mb-2">
                        작성일: {notice.createdAt}
                    </TextComponent>
                    <TextComponent className="text-lg font-bold text-text-default mb-4">
                        {notice.title}
                    </TextComponent>

                    <View className="bg-bg-paper p-4 rounded-xl border border-divider min-h-[200px]">
                        <TextComponent className="text-text-default leading-relaxed">
                            {notice.content}
                        </TextComponent>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserNoticeDetailPage;
