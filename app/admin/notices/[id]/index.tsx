import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import adminApi from "@/api/admin/adminApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { AdminNotice } from "@/types/admin";
import { Alert, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";

function AdminNoticeDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const noticeId = Number(id);

    const [notice, setNotice] = useState<AdminNotice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 수정 폼 상태값
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 상세 정보 불러오기
    useEffect(() => {
        if (!noticeId || isNaN(noticeId)) return;

        const fetchNotice = async () => {
            try {
                setIsLoading(true);
                const data = await adminApi.getNoticeById(noticeId);
                setNotice(data);
                setTitle(data.title);
                setContent(data.content);
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

        fetchNotice();
    }, [noticeId, router]);

    // 수정 요청 처리
    const handleUpdate = async () => {
        if (!title.trim() || !content.trim()) {
            if (Platform.OS === "web") alert("제목과 내용을 모두 입력해주세요.");
            else Alert.alert("알림", "제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            const updated = await adminApi.updateNotice(noticeId, { title, content });
            setNotice(updated);
            setIsEditing(false);
            if (Platform.OS === "web") alert("공지사항이 수정되었습니다.");
            else Alert.alert("성공", "공지사항이 수정되었습니다.");
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") alert("수정 중 오류가 발생했습니다.");
            else Alert.alert("오류", "수정 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // 삭제 요청 처리
    const handleDelete = () => {
        const confirmDelete = async () => {
            try {
                await adminApi.deleteNotice(noticeId);
                if (Platform.OS === "web") {
                    alert("공지사항이 삭제되었습니다.");
                    router.back();
                } else {
                    Alert.alert("성공", "공지사항이 삭제되었습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") alert("삭제 중 오류가 발생했습니다.");
                else Alert.alert("오류", "삭제 중 오류가 발생했습니다.");
            }
        };

        if (Platform.OS === "web") {
            if (confirm("정말 이 공지사항을 삭제하시겠습니까?")) {
                confirmDelete().then(() => {})
            }
        } else {
            Alert.alert("공지사항 삭제", "정말 이 공지사항을 삭제하시겠습니까?", [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive", onPress: confirmDelete },
            ]);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-bg-paper justify-center items-center">
                <LoadingIndicator />
            </View>
        );
    }

    if (!notice) return null;

    return (
        <View className="flex-1 bg-bg-paper p-4 md:p-6 w-full">
            {/* 상단 타이틀 영역 */}
            <View className="mb-6">
                <Title
                    title={isEditing ? "공지사항 수정" : "공지사항 상세"}
                    description={
                        isEditing ? "내용을 수정합니다." : "등록된 공지사항의 상세 내용입니다."
                    }
                    showBackButton={true}
                    onBackPress={() => (isEditing ? setIsEditing(false) : router.back())}
                    className="h-auto py-1"
                />
            </View>

            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {/* 본문 카드 박스 (우리 팔레트 bg-bg-subtle/3동 및 divider 적용) */}
                <View className="bg-bg-subtle/30 border border-divider rounded-2xl p-5 md:p-8 mb-6">
                    {/* 등록일 및 ID 표시 */}
                    <View className="flex-row justify-between items-center pb-4 mb-4 border-b border-divider">
                        <TextComponent className="text-xs text-text-secondary font-medium">
                            No. {notice.id}
                        </TextComponent>
                        <TextComponent className="text-xs text-text-secondary">
                            등록일: {notice.createdAt ? notice.createdAt.substring(0, 10) : ""}
                        </TextComponent>
                    </View>

                    {/* 수정 모드 vs 조회 모드 분기 */}
                    {isEditing ? (
                        <View className="gap-4">
                            <View>
                                <TextComponent className="text-sm font-bold text-text-secondary mb-1">
                                    제목
                                </TextComponent>
                                <TextInput
                                    className="bg-bg-paper border border-divider rounded-xl p-3 text-text-default text-base font-bold"
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="제목을 입력하세요"
                                    placeholderTextColor="var(--text-subtle)"
                                />
                            </View>
                            <View>
                                <TextComponent className="text-sm font-bold text-text-secondary mb-1">
                                    내용
                                </TextComponent>
                                <TextInput
                                    className="bg-bg-paper border border-divider rounded-xl p-3 text-text-default text-base h-60 text-top"
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="내용을 입력하세요"
                                    placeholderTextColor="var(--text-subtle)"
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        </View>
                    ) : (
                        <View className="gap-4">
                            <TextComponent className="text-xl font-bold text-text-default">
                                {notice.title}
                            </TextComponent>
                            <View className="pt-4 border-t border-divider min-h-[200px]">
                                <TextComponent className="text-text-default leading-6 whitespace-pre-wrap">
                                    {notice.content}
                                </TextComponent>
                            </View>
                        </View>
                    )}
                </View>

                {/* 하단 버튼 영역 (우리 팔레트의 primary / error 컬러 변수 활용) */}
                <View className="flex-row justify-end gap-3 pb-6">
                    {isEditing ? (
                        <>
                            <Pressable
                                onPress={() => setIsEditing(false)}
                                className="px-5 py-3 rounded-xl border border-divider bg-bg-subtle">
                                <TextComponent className="font-bold text-text-secondary">
                                    취소
                                </TextComponent>
                            </Pressable>
                            <Pressable
                                onPress={handleUpdate}
                                disabled={isSubmitting}
                                className="px-5 py-3 rounded-xl bg-primary-main">
                                <TextComponent className="font-bold text-primary-contrast">
                                    {isSubmitting ? "저장 중..." : "저장"}
                                </TextComponent>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            {/* 삭제 버튼: 우리 팔레트의 에러 물감 변수 활용 */}
                            <Pressable
                                onPress={handleDelete}
                                className="px-5 py-3 rounded-xl border border-[var(--error-point)] bg-[var(--error-main)]/10">
                                <TextComponent className="font-bold text-[var(--error-point)]">
                                    삭제
                                </TextComponent>
                            </Pressable>
                            {/* 수정 버튼: 우리 팔레트의 primary-main 물감 활용 */}
                            <Pressable
                                onPress={() => setIsEditing(true)}
                                className="px-5 py-3 rounded-xl bg-primary-main">
                                <TextComponent className="font-bold text-primary-contrast">
                                    수정
                                </TextComponent>
                            </Pressable>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeDetailPage;
