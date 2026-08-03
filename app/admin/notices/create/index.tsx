import React from "react";
import { useRouter } from "expo-router";
import { AdminNoticeInputType, adminNoticeSchema } from "@/schemas/admin/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import adminNoticeApi from "@/api/admin/adminNoticeApi"; // ✅ 변경된 공지사항 API import
import { Alert, Platform, ScrollView, TextInput, View, useColorScheme } from "react-native";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";

function AdminNoticeCreatePage() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminNoticeInputType>({
        resolver: zodResolver(adminNoticeSchema),
        mode: "onChange",
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const onSubmit = async (input: AdminNoticeInputType) => {
        try {
            await adminNoticeApi.createNotice(input); // ✅ adminNoticeApi 사용

            if (Platform.OS === "web") {
                alert("공지사항이 성공적으로 등록되었습니다.");
                router.push("/admin/notices");
            } else {
                Alert.alert("완료", "공지사항이 성공적으로 등록되었습니다.", [
                    { text: "확인", onPress: () => router.push("/admin/notices") },
                ]);
            }
        } catch (error) {
            console.log(error);
            const errorMsg = "공지사항 등록에 실패했습니다.";
            Platform.OS === "web" ? alert(errorMsg) : Alert.alert("오류", errorMsg);
        }
    };

    return (
        <View className="flex-1 w-full">
            {/* 상단 타이틀 영역 (다른 어드민 페이지와 통일) */}
            <Title
                title="공지사항 등록"
                description="서비스에 새로운 공지사항을 등록합니다."
                className="h-auto pb-4 mb-6"
            />

            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {/* 입력 폼 카드 컨테이너 (깔끔한 카드 형태로 통일) */}
                <View className="bg-bg-paper border border-divider rounded-2xl p-6 shadow-sm">
                    {/* 제목 입력 */}
                    <View className="mb-5">
                        <TextComponent className="text-sm font-bold text-text-default mb-2">
                            제목
                        </TextComponent>
                        <Controller
                            control={control}
                            name="title"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    placeholder="공지사항 제목을 입력해주세요."
                                    placeholderTextColor={isDark ? "#9C948E" : "#BDBDBD"}
                                    className={twMerge(
                                        "bg-bg-subtle/30 border rounded-xl px-4 py-3 text-text-default transition-colors",
                                        errors.title
                                            ? "border-error-point bg-error-bg"
                                            : "border-divider focus:border-primary-main",
                                    )}
                                />
                            )}
                        />
                        {errors.title && (
                            <TextComponent className="text-error-point text-xs mt-1.5 ml-1">
                                {errors.title.message}
                            </TextComponent>
                        )}
                    </View>

                    {/* 내용 입력 */}
                    <View className="mb-6">
                        <TextComponent className="text-sm font-bold text-text-default mb-2">
                            내용
                        </TextComponent>
                        <Controller
                            control={control}
                            name="content"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    multiline={true}
                                    numberOfLines={8}
                                    textAlignVertical="top"
                                    placeholder="공지사항 상세 내용을 입력해주세요."
                                    placeholderTextColor={isDark ? "#9C948E" : "#BDBDBD"}
                                    className={twMerge(
                                        "bg-bg-subtle/30 border rounded-xl px-4 py-3 text-text-default h-52 transition-colors",
                                        errors.content
                                            ? "border-error-point bg-error-bg"
                                            : "border-divider focus:border-primary-main",
                                    )}
                                />
                            )}
                        />
                        {errors.content && (
                            <TextComponent className="text-error-point text-xs mt-1.5 ml-1">
                                {errors.content.message}
                            </TextComponent>
                        )}
                    </View>

                    {/* 하단 버튼 그룹 (물감 팔레트 호버/포인트 반영) */}
                    <View className="flex-row justify-end items-center gap-3 pt-4 border-t border-divider">
                        <Button
                            size="small"
                            onPress={() => router.push("/admin/notices")}
                            className="bg-bg-subtle border border-divider hover:bg-secondary-contrast active:opacity-85 transition-colors">
                            <TextComponent className="text-text-secondary font-medium text-xs">
                                취소
                            </TextComponent>
                        </Button>
                        <Button
                            size="small"
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="bg-primary-main hover:bg-primary-point active:opacity-85 transition-colors">
                            <TextComponent className="text-white font-bold text-xs">
                                {isSubmitting ? "저장 중..." : "저장"}
                            </TextComponent>
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeCreatePage;
