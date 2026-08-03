import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Pressable, Alert, Platform, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import inquiryApi from "@/api/user/inquiryApi";
import Button from "@/components/common/button/Button";
import { InquiryInputType, inquirySchema } from "@/schemas/user/inquirySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { InquiryUserItemType } from "@/types/inquiry";
import Badge from "@/components/common/badge/Badge";
import InputGroup from "@/components/common/input/InputGroup";

function UserInquiryPage() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<InquiryUserItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [total, setTotal] = useState(0);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const [modalVisible, setModalVisible] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<InquiryInputType>({
        resolver: zodResolver(inquirySchema),
        mode: "onTouched",
        defaultValues: {
            title: "",
            content: "",
        },
    });

    // 목록 불러오기
    const loadInquiries = useCallback(
        async (targetPage: number, targetSize: number) => {
            try {
                setIsLoading(true);
                const result = await inquiryApi.fetchMyInquiryList(targetPage, targetSize);
                setInquiries(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log(error);
                if (Platform.OS === "web") {
                    alert("1:1 문의 목록을 불러오는데 실패했습니다.");
                    router.back();
                } else {
                    Alert.alert("오류", "1:1 문의 목록을 불러오는데 실패했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
            } finally {
                setIsLoading(false);
            }
        },
        [router],
    );

    useEffect(() => {
        loadInquiries(currentPage, pageSize).then(() => {});
    }, [currentPage, loadInquiries, pageSize]);

    const totalPage = Math.ceil(total / pageSize) || 1;

    // 문의 등록 핸들러
    const onSubmit = async (data: InquiryInputType) => {
        try {
            await inquiryApi.createInquiry(data);

            const successMsg = "문의가 성공적으로 등록되었습니다.";
            if (Platform.OS === "web") {
                alert(successMsg);
            } else {
                Alert.alert("성공", successMsg);
            }

            reset();
            setModalVisible(false);
            await loadInquiries(currentPage, pageSize);
        } catch (error) {
            console.log(error);
            const errorMsg = "문의 등록에 실패했습니다.";
            if (Platform.OS === "web") {
                alert(errorMsg);
            } else {
                Alert.alert("오류", errorMsg);
            }
        }
    };

    return (
        <View className="flex-1 bg-bg-default">
            {/* 상단 타이틀 및 작성 버튼 */}
            <Title
                title="1:1 문의"
                showBackButton={true}
                onBackPress={() => router.back()}
                className="mb-6">
                <Button
                    size="small"
                    color="primary"
                    variant="contained-square"
                    onPress={() => setModalVisible(true)}
                    className="px-3 py-1.5 rounded-xl">
                    문의하기
                </Button>
            </Title>

            <ScrollView className="flex-1 px-4 md:px-6">
                <View
                    className={twMerge(
                        "hidden md:flex",
                        "flex-row items-center px-4 py-3",
                        "border-divider border-b bg-primary-main rounded-t-xl",
                    )}>
                    <TextComponent
                        className={twMerge("hidden md:flex w-12", "font-bold text-text-secondary")}>
                        ID
                    </TextComponent>
                    <TextComponent
                        className={twMerge("flex-1", "font-bold text-text-secondary px-2")}>
                        제목
                    </TextComponent>
                    <TextComponent
                        className={twMerge("w-28", "font-bold text-text-secondary text-center")}>
                        처리상태
                    </TextComponent>
                    <TextComponent
                        className={twMerge("w-24", "font-bold text-text-secondary text-center")}>
                        등록일
                    </TextComponent>
                </View>

                {isLoading ? (
                    <View className="py-20 justify-center items-center">
                        <LoadingIndicator />
                    </View>
                ) : inquiries.length === 0 ? (
                    <View className="py-40 justify-center items-center">
                        <TextComponent className="text-text-secondary">
                            등록된 1:1 문의가 없습니다.
                        </TextComponent>
                    </View>
                ) : (
                    inquiries.map((item, index) => {
                        const isAnswered = !!item.answer;

                        return (
                            <View
                                key={item.id}
                                className={twMerge(
                                    "my-2 md:my-0",
                                    "flex-col md:flex-row md:items-center px-4 py-4 md:py-3",
                                    "transition-all bg-bg-paper border-b border-divider hover:bg-bg-subtle rounded-xl md:rounded-none",
                                    index === inquiries.length - 1 && "md:rounded-b-xl border-b-0",
                                )}>
                                <TextComponent
                                    className={twMerge(
                                        "hidden md:flex w-12",
                                        "text-center text-text-secondary",
                                    )}>
                                    {item.id}
                                </TextComponent>

                                <Pressable
                                    className="flex-1 justify-center px-2"
                                    onPress={() => router.push(`/my-page/inquiries/${item.id}`)}>
                                    <View className="mb-1.5 md:hidden self-start">
                                        <Badge
                                            color={isAnswered ? "success" : "warning"}
                                            size="small">
                                            {isAnswered ? "답변완료" : "답변대기"}
                                        </Badge>
                                    </View>

                                    <View className="flex-row items-center gap-2">
                                        <TextComponent
                                            className="font-bold transition-all hover:text-primary-main text-[15px] md:text-base"
                                            numberOfLines={1}>
                                            {item.title}
                                        </TextComponent>
                                    </View>

                                    <TextComponent
                                        className="text-sm text-text-secondary mt-1.5 md:hidden"
                                        numberOfLines={2}>
                                        {item.content || "내용이 없습니다."}
                                    </TextComponent>

                                    <TextComponent
                                        className="text-sm text-text-secondary mt-1 hidden md:flex"
                                        numberOfLines={1}>
                                        {item.content || "내용이 없습니다."}
                                    </TextComponent>

                                    <TextComponent className="text-[11px] text-text-subtle mt-2.5 md:hidden">
                                        {item.createdAt.substring(0, 10).replace(/-/g, ".")}
                                    </TextComponent>
                                </Pressable>

                                <View className="w-28 hidden md:flex justify-center items-center">
                                    <Badge color={isAnswered ? "success" : "warning"} size="small">
                                        {isAnswered ? "답변완료" : "답변대기"}
                                    </Badge>
                                </View>

                                <TextComponent
                                    className={twMerge(
                                        "w-24 text-xs text-text-secondary text-center hidden md:flex",
                                    )}>
                                    {item.createdAt.substring(0, 10).replace(/-/g, ".")}
                                </TextComponent>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* 문의 작성 모달 */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View className="flex-1 bg-black/50 justify-center items-center p-4">
                    <View className="bg-bg-paper w-full max-w-lg rounded-2xl p-6 border border-divider shadow-lg">
                        <TextComponent className="text-lg font-bold text-text-default mb-4">
                            새 1:1 문의 작성
                        </TextComponent>

                        <Controller
                            control={control}
                            name="title"
                            render={({
                                field: { onChange, onBlur, value },
                                fieldState: { error },
                            }) => (
                                <InputGroup
                                    placeholder="제목을 입력해주세요."
                                    placeholderTextColor="#9ca3af"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={error?.message}
                                    size="medium"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="content"
                            render={({
                                field: { onChange, onBlur, value },
                                fieldState: { error },
                            }) => (
                                <InputGroup
                                    placeholder="내용을 입력해주세요."
                                    placeholderTextColor="#9ca3af"
                                    multiline
                                    textAlignVertical="top"
                                    className="min-h-[150px]"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    errorMessage={error?.message}
                                    size="medium"
                                />
                            )}
                        />

                        <View className="flex-row justify-end gap-2 mt-2">
                            <Button
                                size="small"
                                variant="outlined"
                                onPress={() => {
                                    reset();
                                    setModalVisible(false);
                                }}
                                className="px-4 py-2.5 rounded-xl">
                                취소
                            </Button>
                            <Button
                                size="small"
                                color="primary"
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className="px-4 py-2.5 rounded-xl">
                                등록
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default UserInquiryPage;
