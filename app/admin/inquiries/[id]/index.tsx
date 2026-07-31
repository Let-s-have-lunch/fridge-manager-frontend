import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";
import { Alert, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

function AdminInquiryDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);

    const [inquiry, setInquiry] = useState<InquiryUserItemType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [answerText, setAnswerText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadInquiryDetail = useCallback(async () => {
        if (!inquiryId) return;
        try {
            setIsLoading(true);
            const result = await adminInquiryApi.fetchInquiryDetail(inquiryId);
            setInquiry(result);
            setAnswerText(result.answer || "");
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("문의 상세 정보를 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "문의 상세 정보를 불러오는데 실패했습니다.", [
                    { text: "확인", onPress: () => router.back() },
                ]);
            }
        } finally {
            setIsLoading(false);
        }
    }, [inquiryId, router]);

    useEffect(() => {
        loadInquiryDetail();
    }, [loadInquiryDetail]);

    // 답변 등록 또는 수정 핸들러
    const handleSaveAnswer = async () => {
        if (!answerText.trim()) {
            if (Platform.OS === "web") {
                alert("답변 내용을 입력해주세요.");
            } else {
                Alert.alert("알림", "답변 내용을 입력해주세요.");
            }
            return;
        }

        try {
            setIsSubmitting(true);
            await adminInquiryApi.createOrUpdateAnswer(inquiryId, answerText);
            if (Platform.OS === "web") {
                alert("답변이 성공적으로 저장되었습니다.");
            } else {
                Alert.alert("성공", "답변이 성공적으로 저장되었습니다.");
            }
            loadInquiryDetail().then(() => {})
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("답변 저장에 실패했습니다.");
            } else {
                Alert.alert("오류", "답변 저장에 실패했습니다.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // 답변 삭제 핸들러
    const handleDeleteAnswer = async () => {
        const confirmDelete =
            Platform.OS === "web" ? window.confirm("정말 답변을 삭제하시겠습니까?") : true; // 모바일 환경 처리 분기

        if (Platform.OS !== "web") {
            Alert.alert("확인", "정말 답변을 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                {
                    text: "삭제",
                    style: "destructive",
                    onPress: async () => executeDelete(),
                },
            ]);
            return;
        }

        if (confirmDelete) {
            executeDelete().then(() => {})
        }
    };

    const executeDelete = async () => {
        try {
            setIsSubmitting(true);
            await adminInquiryApi.deleteAnswer(inquiryId);
            if (Platform.OS === "web") {
                alert("답변이 삭제되었습니다.");
            }
            setAnswerText("");
            loadInquiryDetail();
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("답변 삭제에 실패했습니다.");
            } else {
                Alert.alert("오류", "답변 삭제에 실패했습니다.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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
            {/* 상단 타이틀 영역 */}
            <View className="mb-6">
                <Title
                    title="1:1 문의 상세"
                    description="문의 내용을 확인하고 답변을 작성합니다."
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    className="h-auto py-1"
                />
            </View>

            {/* 문의글 정보 카드 */}
            <View className="bg-bg-subtle/30 border border-divider rounded-2xl p-5 mb-6">
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center gap-2">
                        <TextComponent className="text-xs text-text-secondary font-medium">
                            No. {inquiry.id}
                        </TextComponent>
                        <TextComponent className="text-xs text-text-secondary">|</TextComponent>
                        <TextComponent className="text-xs text-text-secondary font-medium">
                            작성자: {inquiry.user?.nickname || "탈퇴 회원"}
                        </TextComponent>
                    </View>
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

                <TextComponent className="text-lg font-bold text-text-default mb-3">
                    {inquiry.title}
                </TextComponent>
                <TextComponent className="text-xs text-text-secondary mb-4">
                    작성일: {inquiry.createdAt}
                </TextComponent>

                {/* 문의 내용 본문 */}
                <View className="bg-bg-paper p-4 rounded-xl border border-divider min-h-[120px]">
                    <TextComponent className="text-text-default leading-relaxed">
                        {inquiry.content}
                    </TextComponent>
                </View>
            </View>

            {/* 관리자 답변 작성 영역 */}
            <View className="bg-bg-subtle/30 border border-divider rounded-2xl p-5 mb-10">
                <TextComponent className="font-bold text-text-default text-base mb-3">
                    관리자 답변
                </TextComponent>
                <TextInput
                    className="bg-bg-paper border border-divider rounded-xl p-4 text-text-default text-base min-h-[120px] mb-4 textAlign-top"
                    placeholder="답변 내용을 입력해주세요."
                    placeholderTextColor="#9ca3af"
                    multiline
                    value={answerText}
                    onChangeText={setAnswerText}
                    editable={!isSubmitting}
                />
                <View className="flex-row justify-end gap-3">
                    {inquiry.answer && (
                        <Pressable
                            onPress={handleDeleteAnswer}
                            disabled={isSubmitting}
                            className="px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 active:opacity-80">
                            <TextComponent className="text-red-600 font-bold text-sm">
                                답변 삭제
                            </TextComponent>
                        </Pressable>
                    )}
                    <Pressable
                        onPress={handleSaveAnswer}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-primary active:opacity-80">
                        <TextComponent className="text-white font-bold text-sm">
                            {inquiry.answer ? "답변 수정" : "답변 등록"}
                        </TextComponent>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

export default AdminInquiryDetailPage;
