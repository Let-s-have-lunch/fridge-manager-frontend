import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterUserInputType, registerUserSchema } from "@/schemas/user/registerUserSchema";
import userApi from "@/api/user/userApi";
import { isAxiosError } from "axios";
import {
    KeyboardAvoidingView,
    Platform,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import Label from "@/components/common/label/Label";
import { useSetupLayout } from "@/hooks/useSetupLayout";

export default function AuthRegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterUserInputType>({
        resolver: zodResolver(registerUserSchema),
        mode: "onTouched",
        defaultValues: {
            nickname: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            const { confirmPassword, ...registerData } = data;
            await userApi.registerUser(registerData);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.replace("/auth/login");
            } else {
                Alert.alert("회원가입 완료", "회원가입에 성공했습니다! 로그인해 주세요.", [
                    { text: "확인", onPress: () => router.replace("/auth/login") },
                ]);
            }
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "오류가 발생했습니다.";
                if (error.response.status === 409) {
                    if (errorMessage.includes("닉네임"))
                        setError("nickname", { message: errorMessage });
                    else if (errorMessage.includes("이메일"))
                        setError("email", { message: errorMessage });
                    else setError("root", { message: errorMessage });
                    return;
                }
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알 수 없는 오류가 발생했습니다." });
            }
        }
    };

    useSetupLayout({ showMainFooter: false });

    return (
        <SafeAreaView className="flex-1 bg-bg-default">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: "center",
                    }}
                    showsVerticalScrollIndicator={false}>
                    <View className="flex-1 w-full px-6 pb-10" style={{ maxWidth: 480 }}>
                        {/* 상단 타이틀 영역 */}
                        <View className="items-center py-4 mt-2 mb-2">
                            <Title
                                title="회원가입"
                                className="text-text-default text-lg font-bold"
                            />
                        </View>

                        {/* 입력 영역 */}
                        <View className="w-full">
                            {/* 1. 이름 */}
                            <View className="mb-2">
                                <Label size="small">이름</Label>
                                <Controller
                                    control={control}
                                    name={"nickname"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup errorMessage={errors.nickname?.message}>
                                            <View className="relative justify-center">
                                                <Input
                                                    hasError={!!errors.nickname}
                                                    placeholder="이름을 입력해주세요"
                                                    autoCapitalize="none"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    className={`rounded-[18px] pl-12 py-4 text-base ${!errors.nickname ? "border-primary-main" : ""}`}
                                                />
                                                <View
                                                    className="absolute left-5 z-10"
                                                    pointerEvents="none">
                                                    <Feather
                                                        name="user"
                                                        size={20}
                                                        color="#BDBDBD"
                                                    />
                                                </View>
                                            </View>
                                        </InputGroup>
                                    )}
                                />
                            </View>

                            {/* 2. 이메일 */}
                            <View className="mb-2">
                                <Label size="small">이메일</Label>
                                <Controller
                                    control={control}
                                    name={"email"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup errorMessage={errors.email?.message}>
                                            <View className="relative justify-center">
                                                <Input
                                                    hasError={!!errors.email}
                                                    placeholder="이메일을 입력해주세요"
                                                    keyboardType="email-address"
                                                    autoCapitalize="none"
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    className={`rounded-[18px] pl-12 py-4 text-base ${!errors.email ? "border-primary-main" : ""}`}
                                                />
                                                <View
                                                    className="absolute left-5 z-10"
                                                    pointerEvents="none">
                                                    <Feather
                                                        name="mail"
                                                        size={20}
                                                        color="#BDBDBD"
                                                    />
                                                </View>
                                            </View>
                                        </InputGroup>
                                    )}
                                />
                            </View>

                            {/* 3. 비밀번호 */}
                            <View className="mb-2">
                                <Label size="small">비밀번호</Label>
                                <Controller
                                    control={control}
                                    name={"password"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup errorMessage={errors.password?.message}>
                                            <View className="relative justify-center">
                                                <Input
                                                    hasError={!!errors.password}
                                                    placeholder="비밀번호를 입력해주세요"
                                                    secureTextEntry={!showPassword}
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    className={`rounded-[18px] pl-12 pr-12 py-4 text-base ${!errors.password ? "border-primary-main" : ""}`}
                                                />
                                                <View
                                                    className="absolute left-5 z-10"
                                                    pointerEvents="none">
                                                    <Feather
                                                        name="lock"
                                                        size={20}
                                                        color="#BDBDBD"
                                                    />
                                                </View>
                                                <TouchableOpacity
                                                    className="absolute right-5 z-10"
                                                    onPress={() => setShowPassword(!showPassword)}>
                                                    <Feather
                                                        name={showPassword ? "eye" : "eye-off"}
                                                        size={20}
                                                        color="#BDBDBD"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </InputGroup>
                                    )}
                                />
                            </View>

                            {/* 4. 비밀번호 확인 */}
                            <View className="mb-4">
                                <Label size="small">비밀번호 확인</Label>
                                <Controller
                                    control={control}
                                    name={"confirmPassword"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <InputGroup errorMessage={errors.confirmPassword?.message}>
                                            <View className="relative justify-center">
                                                <Input
                                                    hasError={!!errors.confirmPassword}
                                                    placeholder="비밀번호를 다시 입력해주세요"
                                                    secureTextEntry={!showConfirmPassword}
                                                    onBlur={onBlur}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    className={`rounded-[18px] pl-12 pr-12 py-4 text-base ${!errors.confirmPassword ? "border-primary-main" : ""}`}
                                                />
                                                <View
                                                    className="absolute left-5 z-10"
                                                    pointerEvents="none">
                                                    <Feather
                                                        name="lock"
                                                        size={20}
                                                        color="#BDBDBD"
                                                    />
                                                </View>
                                                <TouchableOpacity
                                                    className="absolute right-5 z-10"
                                                    onPress={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }>
                                                    <Feather
                                                        name={
                                                            showConfirmPassword ? "eye" : "eye-off"
                                                        }
                                                        size={20}
                                                        color="#BDBDBD"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </InputGroup>
                                    )}
                                />
                            </View>

                            {/* 기타 Root 에러 메시지 */}
                            {errors.root?.message && (
                                <TextComponent className="text-error-main text-sm text-center mb-4">
                                    {errors.root.message}
                                </TextComponent>
                            )}

                            {/* 가입하기 버튼 */}
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className={`rounded-xl py-4 items-center justify-center mt-2 ${isSubmitting ? "bg-primary-main/70" : "bg-primary-main"}`}>
                                {isSubmitting ? (
                                    <LoadingIndicator />
                                ) : (
                                    <TextComponent className="text-bg-paper font-bold text-lg tracking-wide">
                                        가입하기
                                    </TextComponent>
                                )}
                            </TouchableOpacity>

                            {/* 로그인으로 돌아가기 */}
                            <View className="flex-row justify-center items-center mt-8">
                                <TextComponent className="text-text-subtle text-[15px] mr-2">
                                    이미 계정이 있으신가요?
                                </TextComponent>
                                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                                    <TextComponent className="text-primary-point font-bold text-[15px]">
                                        로그인
                                    </TextComponent>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
