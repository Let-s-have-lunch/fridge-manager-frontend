import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { InquiryUserItemType } from "@/types/inquiry";
import { Alert, Platform, Pressable, ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import ExpireBadge from "@/components/common/badge/Badge";
import { twMerge } from "tailwind-merge";
import inquiryApi from "@/api/user/inquiryApi";


const BadgeComponent = ExpireBadge as any;

function UserInquiryDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const inquiryId = Number(id);

    const [inquiry, setInquiry] = useState<InquiryUserItemType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadInquiryDetail = useCallback(async () => {
        if (!inquiryId) return;
        try {
            setIsLoading(true);
            const result = await inquiryApi.getMyInquiryById(inquiryId);
            setInquiry(result);
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

    // 내 문의 삭제 핸들러 (답변 대기 상태일 때만 가능)
    const handleDeleteInquiry = async () => {
        const confirmDelete =
            Platform.OS === "web" ? window.confirm("정말 이 문의를 취소(삭제)하시겠습니까?") : true;

        if (Platform.OS !== "web") {
            Alert.alert("확인", "정말 이 문의를 취소하시겠습니까?", [
                { text: "닫기", style: "cancel" },
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
            setIsDeleting(true);
            await inquiryApi.deleteInquiry(inquiryId);
            if (Platform.OS === "web") {
                alert("문의가 삭제되었습니다.");
            }
            router.back();
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                alert("문의 삭제에 실패했습니다.");
            } else {
                Alert.alert("오류", "문의 삭제에 실패했습니다.");
            }
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <View className={twMerge("flex-1 bg-bg-paper justify-center items-center")}>
                <LoadingIndicator />
            </View>
        );
    }

    if (!inquiry) {
        return (
            <View className={twMerge("flex-1 bg-bg-paper justify-center items-center")}>
                <TextComponent className={twMerge("text-text-secondary")}>
                    존재하지 않는 문의글입니다.
                </TextComponent>
            </View>
        );
    }

    return (
        <View className={twMerge("flex-1 w-full")}>
            {/* 상단 타이틀 영역 */}
            <Title
                title="1:1 문의 상세"
                showBackButton={true}
                onBackPress={() => router.back()}
                className="h-auto pb-4 mb-6"
            />

            <ScrollView className={twMerge("flex-1 w-full")} showsVerticalScrollIndicator={false}>
                {/* 단일 통합 카드 컨테이너 (어드민 완벽 동일) */}
                <View
                    className={twMerge(
                        "bg-bg-paper border border-divider rounded-2xl p-6 shadow-sm mb-10",
                    )}>
                    {/* 1. 최상단: 제목 라인 (굵고 큰 폰트 + 하단 보더 라인) */}
                    <View className={twMerge("pb-4 mb-4 border-b border-divider")}>
                        <TextComponent
                            className={twMerge("text-lg font-bold text-text-default")}
                            numberOfLines={1}>
                            제목: {inquiry.title}
                        </TextComponent>
                    </View>

                    {/* 2. 그 아래: No., 작성자, 작성일, 뱃지 라인 (보더 제거) */}
                    <View className={twMerge("flex-row justify-between items-center mb-6")}>
                        <View
                            className={twMerge("flex-row items-center gap-2 flex-1 pr-4")}
                            style={{ flexWrap: "wrap" }}>
                            <TextComponent
                                className={twMerge("text-xs text-text-secondary font-medium")}>
                                No. {inquiry.id}
                            </TextComponent>
                        </View>

                        <View className={twMerge("flex-row items-center gap-2 shrink-0")}>
                            <TextComponent className={twMerge("text-xs text-text-secondary")}>
                                작성일:{" "}
                                {inquiry.createdAt ? inquiry.createdAt.substring(0, 10) : ""}
                            </TextComponent>
                            <BadgeComponent
                                status={inquiry.answer ? "safe" : "warning"}
                                className={twMerge("px-2 py-0.5")}
                                textClasses="text-[10px]">
                                {inquiry.answer ? "답변완료" : "답변대기"}
                            </BadgeComponent>
                        </View>
                    </View>

                    {/* 3. 내용 본문 영역 */}
                    <View
                        className={twMerge(
                            "bg-bg-default border border-divider rounded-xl p-5 mb-8 min-h-[120px]",
                        )}>
                        <TextComponent
                            className={twMerge(
                                "text-text-default leading-relaxed whitespace-pre-wrap",
                            )}>
                            {inquiry.content}
                        </TextComponent>
                    </View>

                    {/* 4. 관리자 답변 스레드 영역 (들여쓰기 제거 및 상단 본문과 정렬 통일) */}
                    <View className={twMerge("pt-6 border-t border-divider")}>
                        <View className={twMerge("flex-row items-center gap-2 mb-2")}>
                            <View
                                className={twMerge(
                                    "w-6 h-6 rounded-full bg-primary-main items-center justify-center",
                                )}>
                                <Feather name="corner-down-right" size={12} color="#FFFFFF" />
                            </View>
                            <TextComponent
                                className={twMerge("font-bold text-text-default text-base")}>
                                관리자 답변
                            </TextComponent>
                        </View>

                        <TextComponent className={twMerge("text-xs text-text-secondary mb-4")}>
                            관리자가 남긴 답변을 확인하실 수 있습니다.
                        </TextComponent>

                        <View>
                            {/* 어드민 TextInput 자리에 읽기 전용 View 배치 */}
                            <View
                                className={twMerge(
                                    "bg-bg-default border border-divider rounded-xl p-4 min-h-[140px] mb-4",
                                    !inquiry.answer && "items-center justify-center", // 답변 없을 땐 중앙 정렬
                                )}>
                                {inquiry.answer ? (
                                    <TextComponent
                                        className={twMerge(
                                            "text-text-default text-base leading-relaxed whitespace-pre-wrap",
                                        )}>
                                        {inquiry.answer}
                                    </TextComponent>
                                ) : (
                                    <TextComponent
                                        className={twMerge("text-text-secondary text-center")}>
                                        현재 담당자가 내용을 확인하고 있습니다.{"\n"}조금만
                                        기다려주시면 감사하겠습니다.
                                    </TextComponent>
                                )}
                            </View>

                            {/* 우측 하단 버튼 영역 (답변이 없을 때만 삭제 버튼 활성화) */}
                            <View className={twMerge("flex-row justify-end gap-3")}>
                                {!inquiry.answer && (
                                    <Pressable
                                        onPress={handleDeleteInquiry}
                                        disabled={isDeleting}
                                        className={twMerge(
                                            "px-5 py-2.5 rounded-xl border border-error-point bg-error-bg hover:bg-error-point/10 active:opacity-85 transition-colors",
                                        )}>
                                        <TextComponent
                                            className={twMerge(
                                                "text-error-point font-bold text-xs",
                                            )}>
                                            {isDeleting ? "삭제 중..." : "문의 취소(삭제)"}
                                        </TextComponent>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserInquiryDetailPage;
