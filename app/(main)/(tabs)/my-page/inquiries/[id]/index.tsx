import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import inquiryApi from "@/api/user/inquiryApi";

interface InquiryDetailType {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    answer?: string;
}

function UserInquiryDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);

    const [inquiry, setInquiry] = useState<InquiryDetailType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadDetail = useCallback(async () => {
        if (!inquiryId) return;
        try {
            setIsLoading(true);
            const data = await inquiryApi.fetchInquiryDetail(inquiryId);
            setInquiry(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, [inquiryId]);

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

    if (!inquiry) {
        return (
            <View className="flex-1 bg-bg-paper p-6 justify-center items-center">
                <TextComponent className="text-text-secondary">
                    존재하지 않는 문의글입니다.
                </TextComponent>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-bg-paper p-4 md:p-6 w-full"
            showsVerticalScrollIndicator={false}>
            {/* 상단 타이틀 */}
            <View className="mb-6">
                <Title
                    title="1:1 문의 상세"
                    description="작성하신 문의 내용과 답변을 확인합니다."
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    className="h-auto py-1"
                />
            </View>

            {/* 문의글 내용 카드 */}
            <View className="bg-bg-subtle/30 border border-divider rounded-2xl p-5 mb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <TextComponent className="text-xs text-text-secondary font-medium">
                        작성일: {inquiry.createdAt}
                    </TextComponent>
                    <View
                        className={twMerge(
                            "px-2.5 py-1 rounded-full",
                            inquiry.answer ? "bg-emerald-500/10" : "bg-blue-500/10",
                        )}>
                        <TextComponent
                            className={twMerge(
                                "text-xs font-bold",
                                inquiry.answer ? "text-emerald-600" : "text-blue-600",
                            )}>
                            {inquiry.answer ? "답변완료" : "답변대기"}
                        </TextComponent>
                    </View>
                </View>

                <TextComponent className="text-lg font-bold text-text-default mb-4">
                    {inquiry.title}
                </TextComponent>

                <View className="bg-bg-paper p-4 rounded-xl border border-divider min-h-[120px]">
                    <TextComponent className="text-text-default leading-relaxed">
                        {inquiry.content}
                    </TextComponent>
                </View>
            </View>

            {/* 관리자 답변 영역 */}
            <View className="bg-bg-subtle/30 border border-divider rounded-2xl p-5 mb-10">
                <TextComponent className="font-bold text-text-default text-base mb-3">
                    관리자 답변
                </TextComponent>
                <View className="bg-bg-paper p-4 rounded-xl border border-divider min-h-[120px]">
                    {inquiry.answer ? (
                        <TextComponent className="text-text-default leading-relaxed">
                            {inquiry.answer}
                        </TextComponent>
                    ) : (
                        <TextComponent className="text-text-secondary">
                            아직 등록된 답변이 없습니다. 조금만 기다려주세요!
                        </TextComponent>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

export default UserInquiryDetailPage;
