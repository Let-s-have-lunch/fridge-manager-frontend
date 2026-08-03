import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
    useColorScheme,
} from "react-native";
import adminInquiryApi from "@/api/admin/adminInquiryApi";
import { Feather } from "@expo/vector-icons";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ExpireBadge from "@/components/common/badge/Badge";

function AdminInquiryDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
        loadInquiryDetail().then(() => {});
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
            loadInquiryDetail().then(() => {});
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
            Platform.OS === "web" ? window.confirm("정말 답변을 삭제하시겠습니까?") : true;

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
            executeDelete().then(() => {});
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
            <View className="flex-1 bg-bg-paper justify-center items-center">
                <LoadingIndicator />
            </View>
        );
    }

    if (!inquiry) {
        return (
            <View className="flex-1 bg-bg-paper justify-center items-center">
                <TextComponent className="text-text-secondary">
                    존재하지 않는 문의글입니다.
                </TextComponent>
            </View>
        );
    }

    return (
        <View className="flex-1 w-full">
            {/* 상단 타이틀 영역 */}
            <Title
                title="1:1 문의 상세"
                description="문의 내용을 확인하고 답변을 작성합니다."
                showBackButton={true}
                onBackPress={() => router.back()}
                className="h-auto pb-4 mb-6"
            />

            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {/* 단일 통합 카드 컨테이너 (문의 내용과 답변 스레드가 하나로 연결됨) */}
                <View className="bg-bg-paper border border-divider rounded-2xl p-6 shadow-sm mb-10">
                    {/* 1. 헤더 (ID, 작성자, 뱃지) */}
                    <View className="flex-row justify-between items-center pb-4 mb-5 border-b border-divider">
                        <View className="flex-row items-center gap-2">
                            <TextComponent className="text-xs text-text-secondary font-medium">
                                No. {inquiry.id}
                            </TextComponent>
                            <TextComponent className="text-xs text-text-secondary">|</TextComponent>
                            <TextComponent className="text-xs text-text-secondary font-medium">
                                작성자: {inquiry.user?.nickname || "탈퇴 회원"}
                            </TextComponent>
                        </View>
                        <ExpireBadge
                            status={inquiry.answer ? "safe" : "warning"}
                            className="px-2.5 py-1"
                            textClasses="text-[10px]">
                            {inquiry.answer ? "답변완료" : "답변대기"}
                        </ExpireBadge>
                    </View>

                    {/* 2. 문의글 제목 및 작성일 */}
                    <TextComponent className="text-lg font-bold text-text-default mb-2">
                        {inquiry.title}
                    </TextComponent>
                    <TextComponent className="text-xs text-text-secondary mb-5">
                        작성일: {inquiry.createdAt}
                    </TextComponent>

                    {/* 3. 문의 내용 본문 */}
                    <View className="bg-bg-subtle/30 p-4 rounded-xl border border-divider min-h-[100px] mb-8">
                        <TextComponent className="text-text-default leading-relaxed">
                            {inquiry.content}
                        </TextComponent>
                    </View>

                    {/* 4. 관리자 답변 스레드 영역 (하나의 카드 안에서 자연스럽게 파생된 답변 기능) */}
                    <View className="pt-6 border-t border-divider">
                        <View className="flex-row items-center gap-2 mb-2">
                            <View className="w-6 h-6 rounded-full bg-primary-main items-center justify-center">
                                <Feather name="corner-down-right" size={12} color="#FFFFFF" />
                            </View>
                            <TextComponent className="font-bold text-text-default text-base">
                                관리자 답변
                            </TextComponent>
                        </View>

                        <TextComponent className="text-xs text-text-secondary mb-4 ml-8">
                            등록된 답변은 사용자 화면에 즉시 반영됩니다.
                        </TextComponent>

                        <View className="ml-0 md:ml-8">
                            <TextInput
                                className="bg-bg-subtle/40 border border-divider rounded-xl p-4 text-text-default text-base min-h-[140px] mb-4 focus:border-primary-main transition-colors"
                                placeholder="답변 내용을 상세히 입력해주세요."
                                placeholderTextColor={isDark ? "#9C948E" : "#BDBDBD"}
                                multiline
                                textAlignVertical="top"
                                value={answerText}
                                onChangeText={setAnswerText}
                                editable={!isSubmitting}
                            />

                            <View className="flex-row justify-end gap-3">
                                {inquiry.answer && (
                                    <Pressable
                                        onPress={handleDeleteAnswer}
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 rounded-xl border border-error-point bg-error-bg hover:bg-error-point/10 active:opacity-85 transition-colors">
                                        <TextComponent className="text-error-point font-bold text-xs">
                                            답변 삭제
                                        </TextComponent>
                                    </Pressable>
                                )}
                                <Pressable
                                    onPress={handleSaveAnswer}
                                    disabled={isSubmitting}
                                    className="px-6 py-2.5 rounded-xl bg-primary-main hover:bg-primary-point active:opacity-85 transition-colors shadow-sm">
                                    <TextComponent className="text-white font-bold text-xs">
                                        {isSubmitting
                                            ? "저장 중..."
                                            : inquiry.answer
                                                ? "답변 수정하기"
                                                : "답변 등록하기"}
                                    </TextComponent>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminInquiryDetailPage;