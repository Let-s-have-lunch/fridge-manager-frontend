import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, TextInput, Pressable, Alert, Platform, Modal } from "react-native";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import inquiryApi from "@/api/user/inquiryApi";

interface InquiryItem {
    id: number;
    title: string;
    createdAt: string;
    answer?: string;
}

function UserInquiryPage() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 문의 작성 모달 상태
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 목록 불러오기
    const loadInquiries = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await inquiryApi.fetchMyInquiries();
            setInquiries(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInquiries();
    }, [loadInquiries]);

    // 문의 등록 핸들러
    const handleCreateInquiry = async () => {
        if (!title.trim() || !content.trim()) {
            const msg = "제목과 내용을 모두 입력해주세요.";
            Platform.OS === "web" ? alert(msg) : Alert.alert("알림", msg);
            return;
        }

        try {
            setIsSubmitting(true);
            await inquiryApi.createInquiry({ title, content });

            const successMsg = "문의가 성공적으로 등록되었습니다.";
            Platform.OS === "web" ? alert(successMsg) : Alert.alert("성공", successMsg);

            setTitle("");
            setContent("");
            setModalVisible(false);
            loadInquiries(); // 목록 새로고침
        } catch (error) {
            console.log(error);
            const errorMsg = "문의 등록에 실패했습니다.";
            Platform.OS === "web" ? alert(errorMsg) : Alert.alert("오류", errorMsg);
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

    return (
        <View className="flex-1 bg-bg-paper p-4 md:p-6">
            {/* 상단 타이틀 및 작성 버튼 */}
            <View className="flex-row justify-between items-center mb-6">
                <Title
                    title="1:1 문의"
                    description="궁금하신 점을 남겨주시면 빠르게 답변해 드립니다."
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    className="h-auto py-1 flex-1"
                />
                <Pressable
                    onPress={() => setModalVisible(true)}
                    className="bg-primary px-4 py-2.5 rounded-xl active:opacity-80">
                    <TextComponent className="text-white font-bold text-sm">문의하기</TextComponent>
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {!Array.isArray(inquiries) || inquiries.length === 0 ? (
                    <View className="py-20 items-center justify-center">
                        <TextComponent className="text-text-secondary text-base">
                            등록된 1:1 문의가 없습니다.
                        </TextComponent>
                    </View>
                ) : (
                    inquiries.map(item => (
                        <Pressable
                            key={item.id}
                            onPress={() => router.push(`/my-page/inquiries/${item.id}`)}
                            className="bg-bg-subtle/30 border border-divider rounded-2xl p-4 mb-3 active:opacity-70">
                            <View className="flex-row justify-between items-center mb-2">
                                <TextComponent className="text-xs text-text-secondary">
                                    {item.createdAt}
                                </TextComponent>
                                <View
                                    className={twMerge(
                                        "px-2 py-0.5 rounded-full",
                                        item.answer ? "bg-emerald-500/10" : "bg-blue-500/10",
                                    )}>
                                    <TextComponent
                                        className={twMerge(
                                            "text-xs font-bold",
                                            item.answer ? "text-emerald-600" : "text-blue-600",
                                        )}>
                                        {item.answer ? "답변완료" : "답변대기"}
                                    </TextComponent>
                                </View>
                            </View>
                            <TextComponent className="font-bold text-text-default text-base">
                                {item.title}
                            </TextComponent>
                        </Pressable>
                    ))
                )}
            </ScrollView>

            {/* 문의 작성 모달 */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View className="flex-1 bg-black/50 justify-center items-center p-4">
                    <View className="bg-bg-paper w-full max-w-lg rounded-2xl p-6 border border-divider shadow-lg">
                        <TextComponent className="text-lg font-bold text-text-default mb-4">
                            새 1:1 문의 작성
                        </TextComponent>

                        <TextInput
                            className="bg-bg-subtle/30 border border-divider rounded-xl p-3 text-text-default text-base mb-3"
                            placeholder="제목을 입력해주세요."
                            placeholderTextColor="#9ca3af"
                            value={title}
                            onChangeText={setTitle}
                        />

                        <TextInput
                            className="bg-bg-subtle/30 border border-divider rounded-xl p-3 text-text-default text-base min-h-[150px] mb-4 textAlign-top"
                            placeholder="내용을 입력해주세요."
                            placeholderTextColor="#9ca3af"
                            multiline
                            value={content}
                            onChangeText={setContent}
                        />

                        <View className="flex-row justify-end gap-2">
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="px-4 py-2.5 rounded-xl bg-bg-subtle border border-divider">
                                <TextComponent className="text-text-secondary font-bold text-sm">
                                    취소
                                </TextComponent>
                            </Pressable>
                            <Pressable
                                onPress={handleCreateInquiry}
                                disabled={isSubmitting}
                                className="px-4 py-2.5 rounded-xl bg-primary">
                                <TextComponent className="text-white font-bold text-sm">
                                    등록
                                </TextComponent>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default UserInquiryPage;
