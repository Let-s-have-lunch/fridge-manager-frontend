import { useState } from "react";
import { Alert, Platform, ScrollView, View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";

import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import userApi from "@/api/user/userApi";
import { updatePasswordSchema, UpdatePasswordInputType } from "@/schemas/user/changePasswordSchema";

export default function ChangePasswordPage() {
    // 비밀번호 표시/숨김 상태 관리
    const [showPrevPassword, setShowPrevPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            prevPassword: "",
            password: "",
            confirmPassword: "",
        },
        mode: "onTouched", // 포커스가 빠질 때(onBlur) 에러 검증
    });

    const onSubmit = async (data: UpdatePasswordInputType) => {
        try {
            await userApi.changePassword(data);

            const successMessage = "비밀번호가 성공적으로 변경되었습니다.";
            const handleSuccessMove = () => {
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.replace("/my-page");
                }
            };

            if (Platform.OS === "web") {
                window.alert(successMessage);
                handleSuccessMove();
            } else {
                Alert.alert(
                    "성공",
                    successMessage,
                    [
                        {
                            text: "확인",
                            onPress: handleSuccessMove,
                        },
                    ],
                    { cancelable: false },
                );
            }
        } catch (error: any) {
            console.error("비밀번호 변경 실패:", error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                if (error.response.status === 400) {
                    if (errorMessage.includes("비밀번호")) {
                        setError("root", { message: errorMessage });
                        return;
                    }
                }
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className="flex-1 bg-bg-default">
            <Title
                title={"비밀번호 수정"}
                showBackButton={true}
                onBackPress={() => router.back()}
            />

            <ScrollView
                className="flex-1 px-6 pt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>
                <View className="mb-5">
                    {/* 현재 비밀번호 */}
                    <Controller
                        control={control}
                        name={"prevPassword"}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                size={"small"}
                                label={"현재 비밀번호"}
                                errorMessage={errors.prevPassword?.message}>
                                <View className="relative justify-center w-full">
                                    <Input
                                        size={"small"}
                                        id={"prevPassword"}
                                        placeholder={"현재 비밀번호를 입력하세요."}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPrevPassword}
                                        hasError={!!errors.prevPassword}
                                        className="pr-12" // 아이콘이 들어갈 우측 여백 확보
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPrevPassword(!showPrevPassword)}
                                        className="absolute right-3 p-2 z-10">
                                        <Ionicons
                                            name={
                                                showPrevPassword ? "eye-off-outline" : "eye-outline"
                                            }
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </InputGroup>
                        )}
                    />

                    {/* 새 비밀번호 */}
                    <Controller
                        control={control}
                        name={"password"}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                size={"small"}
                                label={"변경할 비밀번호"}
                                errorMessage={errors.password?.message}>
                                <View className="relative justify-center w-full">
                                    <Input
                                        size={"small"}
                                        id={"password"}
                                        placeholder={"변경할 비밀번호를 입력해주세요."}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        hasError={!!errors.password}
                                        className="pr-12"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 p-2 z-10">
                                        <Ionicons
                                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </InputGroup>
                        )}
                    />

                    {/* 새 비밀번호 확인 */}
                    <Controller
                        control={control}
                        name={"confirmPassword"}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputGroup
                                size={"small"}
                                label={"변경할 비밀번호 확인"}
                                errorMessage={errors.confirmPassword?.message}>
                                <View className="relative justify-center w-full">
                                    <Input
                                        size={"small"}
                                        id={"confirmPassword"}
                                        placeholder={"변경할 비밀번호를 다시 입력해주세요."}
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showConfirmPassword}
                                        hasError={!!errors.confirmPassword}
                                        className="pr-12"
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 p-2 z-10">
                                        <Ionicons
                                            name={
                                                showConfirmPassword
                                                    ? "eye-off-outline"
                                                    : "eye-outline"
                                            }
                                            size={20}
                                            color="#9ca3af"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </InputGroup>
                        )}
                    />
                </View>

                {/* 백엔드 등에서 넘어온 최상단(Root) 에러 메시지 처리 */}
                {errors.root?.message && (
                    <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                        {errors.root?.message}
                    </ErrorMessage>
                )}

                <View className={"mt-3"}>
                    <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting} size={"small"}>
                        변경하기
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}
