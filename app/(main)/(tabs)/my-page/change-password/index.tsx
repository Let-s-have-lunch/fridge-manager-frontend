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
        mode: "onTouched",
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
        <View className="flex-1 bg-bg-default items-center">
            <View className={"flex-1 w-full max-w-[480px]"}>
                <Title
                    title={"비밀번호 변경"}
                    showBackButton={true}
                    onBackPress={() => router.back()}
                />

                <ScrollView
                    className="flex-1 px-6 pt-4"
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}>
                    <View className="mb-2">
                        {/* 현재 비밀번호 */}
                        <Controller
                            control={control}
                            name={"prevPassword"}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label={"현재 비밀번호"}
                                    errorMessage={errors.prevPassword?.message}
                                    className="mb-8">
                                    <View className="relative justify-center w-full">
                                        <Input
                                            id={"prevPassword"}
                                            placeholder={"현재 비밀번호를 입력해주세요."}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry={!showPrevPassword}
                                            hasError={!!errors.prevPassword}
                                            searchIcon={
                                                <Ionicons
                                                    name="lock-closed-outline"
                                                    size={20}
                                                    color="#9ca3af"
                                                />
                                            }
                                            className="pr-12"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPrevPassword(!showPrevPassword)}
                                            className="absolute right-3 p-2 z-10">
                                            <Ionicons
                                                name={
                                                    showPrevPassword
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

                        <Controller
                            control={control}
                            name={"password"}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    size={"small"}
                                    label={"새 비밀번호"}
                                    errorMessage={errors.password?.message}
                                    className="mb-8">
                                    <View className="relative justify-center w-full">
                                        <Input
                                            size={"small"}
                                            id={"password"}
                                            placeholder={"새 비밀번호를 입력해주세요 (6자 이상)."}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry={!showPassword}
                                            hasError={!!errors.password}
                                            searchIcon={
                                                <Ionicons
                                                    name="lock-closed-outline"
                                                    size={20}
                                                    color="#9ca3af"
                                                />
                                            }
                                            className="pr-12"
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 p-2 z-10">
                                            <Ionicons
                                                name={
                                                    showPassword ? "eye-off-outline" : "eye-outline"
                                                }
                                                size={20}
                                                color="#9ca3af"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </InputGroup>
                            )}
                        />

                        <Controller
                            control={control}
                            name={"confirmPassword"}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    size={"small"}
                                    label={"새 비밀번호 확인"}
                                    errorMessage={errors.confirmPassword?.message}
                                    className="mb-10">
                                    <View className="relative justify-center w-full">
                                        <Input
                                            size={"small"}
                                            id={"confirmPassword"}
                                            placeholder={"새 비밀번호를 다시 입력해주세요."}
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry={!showConfirmPassword}
                                            hasError={!!errors.confirmPassword}
                                            searchIcon={
                                                <Ionicons
                                                    name="lock-closed-outline"
                                                    size={20}
                                                    color="#9ca3af"
                                                />
                                            }
                                            className="pr-12"
                                        />
                                        <TouchableOpacity
                                            onPress={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
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

                    {errors.root?.message && (
                        <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                            {errors.root?.message}
                        </ErrorMessage>
                    )}

                    <View className={"mt-8"}>
                        <Button onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
                            변경하기
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
