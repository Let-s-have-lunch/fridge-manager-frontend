import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
    KeyboardAvoidingView,
    Platform,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { LoginUserInputType, loginUserSchema } from "@/schemas/user/loginUserSchema";
import userApi from "@/api/user/userApi";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSetupLayout } from "@/hooks/useSetupLayout";

import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";

export default function AuthLoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginUserInputType>({
        resolver: zodResolver(loginUserSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginUserInputType) => {
        try {
            const result = await userApi.login(data);
            if (result.user && result.token) {
                login(result.user, result.token);
            }
            router.replace("/");
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data.message || "로그인 중 오류가 발생했습니다.";

                if (error.response.status === 400 || error.response.status === 401) {
                    setError("root", { message: errorMessage });
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
                        justifyContent: "center",
                    }}
                    showsVerticalScrollIndicator={false}>
                    <View
                        className="flex-1 w-full px-6 pt-6 pb-10 justify-center"
                        style={{ maxWidth: 480 }}>

                        {/* 1. 상단 로고 영역 */}
                        <View className="items-center mt-0 mb-16">
                            <View
                                className="bg-bg-paper w-[130px] h-[130px] rounded-[32px] items-center justify-center overflow-hidden"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.04,
                                    shadowRadius: 12,
                                    elevation: 2,
                                }}>
                                <Image
                                    source={require("@/assets/images/logo.png")}
                                    style={{
                                        width: 210,
                                        height: 210,
                                        transform: [{ translateY: 12 }],
                                    }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>

                        {/* 2. 커스텀 InputGroup & Input 영역 */}
                        <View className="w-full">
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
                                                <Feather name="mail" size={20} color="#BDBDBD" />
                                            </View>
                                        </View>
                                    </InputGroup>
                                )}
                            />

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
                                                <Feather name="lock" size={20} color="#BDBDBD" />
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

                            {/* 기타 Root Error 메시지 */}
                            {errors.root?.message && (
                                <TextComponent className="text-error-main text-center text-sm mt-1 mb-2">
                                    {errors.root.message}
                                </TextComponent>
                            )}

                            {/* 3. 로그인 버튼 (삭제된 영역을 대신해 상단 여백 mt-8 추가) */}
                            <Button
                                size={"large"}
                                fullWidth
                                className={`mt-8 ${isSubmitting ? "opacity-60" : ""}`}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    "로그인"
                                )}
                            </Button>
                        </View>

                        {/* 4. 회원가입 유도 영역 */}
                        <View className="flex-row justify-center items-center mt-8">
                            <TextComponent className="text-text-subtle text-[15px] mr-2">
                                계정이 없으신가요?
                            </TextComponent>
                            <TouchableOpacity
                                onPress={() => router.replace("/(main)/auth/register")}>
                                <TextComponent className="text-primary-point font-bold text-[15px]">
                                    회원가입
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}