import { useRouter } from "expo-router";
import { AdminNoticeInputType, adminNoticeSchema } from "@/schemas/admin/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import adminApi from "@/api/admin/adminApi";
import { Alert, Platform, ScrollView, TextInput, View } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";

function AdminNoticeCreatePage() {
    const router = useRouter();

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
            await adminApi.createNotice(input);

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
        <View className="flex-1 bg-bg-paper p-6">
            <View className="mb-6">
                <TextComponent className="text-xl font-bold text-text-default">
                    공지사항 등록
                </TextComponent>
                <TextComponent className="text-sm text-text-secondary mt-1">
                    서비스에 새로운 공지사항을 등록합니다.
                </TextComponent>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="bg-bg-subtle p-5 rounded-2xl border border-divider">
                    {/* 제목 입력 */}
                    <View className="mb-4">
                        <TextComponent className="text-sm font-bold text-text-secondary mb-2">
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
                                    placeholderTextColor="#777777"
                                    className={twMerge(
                                        "bg-bg-paper border rounded-xl px-4 py-3 text-text-default",
                                        errors.title ? "border-red-500" : "border-divider",
                                    )}
                                />
                            )}
                        />
                        {errors.title && (
                            <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                                {errors.title.message}
                            </TextComponent>
                        )}
                    </View>

                    {/* 내용 입력 */}
                    <View className="mb-4">
                        <TextComponent className="text-sm font-bold text-text-secondary mb-2">
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
                                    placeholderTextColor="#777777"
                                    className={twMerge(
                                        "bg-bg-paper border rounded-xl px-4 py-3 text-text-default h-48",
                                        errors.content ? "border-red-500" : "border-divider",
                                    )}
                                />
                            )}
                        />
                        {errors.content && (
                            <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                                {errors.content.message}
                            </TextComponent>
                        )}
                    </View>

                    <View className="flex-row justify-end items-center gap-3 mt-6">
                        <Button size="small" onPress={() => router.push("/admin/notices")}>
                            취소
                        </Button>
                        <Button
                            size="small"
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="bg-primary-main">
                            {isSubmitting ? "저장 중..." : "저장"}
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminNoticeCreatePage;
