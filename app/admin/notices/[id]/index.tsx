import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import adminNoticeApi from "@/api/admin/adminNoticeApi";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { AdminNotice } from "@/types/admin";
import {
    Alert,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
    useColorScheme,
} from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";
import Button from "@/components/common/button/Button";

function AdminNoticeDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const noticeId = Number(id);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
                const data = await adminNoticeApi.getNoticeById(noticeId);
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

        fetchNotice().then(() => {});
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
            const updated = await adminNoticeApi.updateNotice(noticeId, { title, content });
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
                await adminNoticeApi.deleteNotice(noticeId);
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
                confirmDelete().then(() => {});
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
        <View className="flex-1 w-full">
            {/* 상단 타이틀 영역 */}
            <Title
                title={isEditing ? "공지사항 수정" : "공지사항 상세"}
                description={
                    isEditing ? "내용을 수정합니다." : "등록된 공지사항의 상세 내용입니다."
                }
                showBackButton={true}
                onBackPress={() => (isEditing ? setIsEditing(false) : router.back())}
                className="h-auto pb-4 mb-6"
            />

            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {/* 본문 카드 박스 */}
                <View className="bg-bg-paper border border-divider rounded-2xl p-6 shadow-sm mb-6">
                    {/* 1. 최상단: 제목 라인 (굵고 큰 폰트 + 하단 보더 라인) */}
                    <View className="pb-4 mb-4 border-b border-divider">
                        {isEditing ? (
                            <TextInput
                                className="w-full bg-bg-subtle/30 border border-divider rounded-lg px-3 py-2 text-text-default text-lg font-bold focus:border-primary-main"
                                value={title}
                                onChangeText={setTitle}
                                placeholder="제목을 입력하세요"
                                placeholderTextColor={isDark ? "#9C948E" : "#BDBDBD"}
                            />
                        ) : (
                            <TextComponent
                                className="text-lg font-bold text-text-default"
                                numberOfLines={1}>
                                {notice.title}
                            </TextComponent>
                        )}
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

                    {/* 3. 내용 본문 또는 수정용 내용 입력 영역 */}
                    <View className="min-h-[200px]">
                        {isEditing ? (
                            <View>
                                <TextComponent className="text-sm font-bold text-text-default mb-2">
                                    내용
                                </TextComponent>
                                <TextInput
                                    className="bg-bg-subtle/30 border border-divider rounded-xl px-4 py-3 text-text-default text-base h-60 focus:border-primary-main transition-colors"
                                    value={content}
                                    onChangeText={setContent}
                                    placeholder="내용을 입력하세요"
                                    placeholderTextColor={isDark ? "#9C948E" : "#BDBDBD"}
                                    multiline
                                    textAlignVertical="top"
                                />
                            </View>
                        ) : (
                            <TextComponent className="text-text-default leading-6 whitespace-pre-wrap">
                                {notice.content}
                            </TextComponent>
                        )}
                    </View>
                </View>

                {/* 하단 버튼 영역 */}
                <View className="flex-row justify-end gap-3 pb-6">
                    {isEditing ? (
                        <>
                            <Pressable
                                onPress={() => setIsEditing(false)}
                                className="px-5 py-3 rounded-xl border border-divider bg-bg-subtle hover:bg-secondary-contrast active:opacity-85 transition-colors">
                                <TextComponent className="font-bold text-text-secondary text-xs">
                                    취소
                                </TextComponent>
                            </Pressable>
                            <Pressable
                                onPress={handleUpdate}
                                disabled={isSubmitting}
                                className="px-5 py-3 rounded-xl bg-primary-main hover:bg-primary-point active:opacity-85 transition-colors">
                                <TextComponent className="font-bold text-white text-xs">
                                    {isSubmitting ? "저장 중..." : "저장"}
                                </TextComponent>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <View className="flex-row gap-3">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    onPress={handleDelete}
                                    className="rounded-xl border-error-point bg-bg-default px-4 py-2"
                                    textClassName="text-sm font-bold text-error-point">
                                    삭제
                                </Button>

                                <Button
                                    variant="contained-square"
                                    size="small"
                                    color="primary"
                                    onPress={() => setIsEditing(true)}
                                    className="rounded-xl px-5 py-3"
                                    textClassName="text-sm font-bold text-white">
                                    수정
                                </Button>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeDetailPage;
