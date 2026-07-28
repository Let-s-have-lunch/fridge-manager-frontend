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
            birthdate: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: RegisterUserInputType) => {
        try {
            const { confirmPassword, ...registerData } = data;
            await userApi.registerUser(registerData);

            const successMessage = "회원가입에 성공했습니다! 로그인해 주세요.";
            const handleSuccessMove = () => router.replace("/auth/login");

            if (Platform.OS === "web") {
                window.alert(successMessage);
                handleSuccessMove();
            } else {
                Alert.alert("회원가입 완료", successMessage, [
                    { text: "확인", onPress: handleSuccessMove },
                ]);
            }
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "오류가 발생했습니다.";
                const errorData = error.response.data;

                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    errorData.errors.forEach((err: { field: string; message: string }) => {
                        if (err.field === "nickname")
                            setError("nickname", { message: err.message });
                        else if (err.field === "email") setError("email", { message: err.message });
                        else if (err.field === "birthdate")
                            setError("birthdate", { message: err.message }); // 💡 birthdate로 수정
                        else if (err.field === "password")
                            setError("password", { message: err.message });
                    });
                    return;
                }

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
                        justifyContent: "center",
                        paddingBottom: 20,
                    }}
                    showsVerticalScrollIndicator={false}>
                    <View
                        className="flex-1 w-full px-6 py-2"
                        style={{ maxWidth: 480, alignSelf: "center", justifyContent: "center" }}>
                        {/* 상단 타이틀 */}
                        <View className="px-2 pb-3 items-center">
                            <Title
                                title="회원가입"
                                className="text-text-default text-lg font-bold"
                            />
                        </View>

                        <View className="w-full">
                            {/* 닉네임 입력 */}
                            <View className="mb-3">
                                <Label size="small">이름</Label>
                                <Controller
                                    control={control}
                                    name={"nickname"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <InputGroup>
                                                <View className="relative justify-center flex-row items-center">
                                                    <Feather
                                                        name="user"
                                                        size={20}
                                                        color="#9ca3af"
                                                        style={{
                                                            position: "absolute",
                                                            left: 16,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="이름을 입력해주세요"
                                                        placeholderTextColor="#9ca3af"
                                                        autoCapitalize="none"
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        hasError={!!errors.nickname}
                                                        className="w-full pl-12 pr-4 py-3 text-base font-medium rounded-2xl"
                                                    />
                                                </View>
                                            </InputGroup>
                                            {errors.nickname?.message && (
                                                <TextComponent className="text-red-500 text-xs mt-1 ml-1">
                                                    {errors.nickname.message}
                                                </TextComponent>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* 이메일 입력 */}
                            <View className="mb-3">
                                <Label size="small">이메일</Label>
                                <Controller
                                    control={control}
                                    name={"email"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <InputGroup>
                                                <View className="relative justify-center flex-row items-center">
                                                    <Feather
                                                        name="mail"
                                                        size={20}
                                                        color="#9ca3af"
                                                        style={{
                                                            position: "absolute",
                                                            left: 16,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="이메일을 입력해주세요"
                                                        placeholderTextColor="#9ca3af"
                                                        keyboardType="email-address"
                                                        autoCapitalize="none"
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        hasError={!!errors.email}
                                                        className="w-full pl-12 pr-4 py-3 text-base font-medium rounded-2xl"
                                                    />
                                                </View>
                                            </InputGroup>
                                            {errors.email?.message && (
                                                <TextComponent className="text-red-500 text-xs mt-1 ml-1">
                                                    {errors.email.message}
                                                </TextComponent>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* 생년월일 입력 */}
                            <View className="mb-3">
                                <Label size="small">생년월일</Label>
                                <Controller
                                    control={control}
                                    name={"birthdate"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <InputGroup>
                                                <View className="relative justify-center flex-row items-center">
                                                    <Feather
                                                        name="calendar"
                                                        size={20}
                                                        color="#9ca3af"
                                                        style={{
                                                            position: "absolute",
                                                            left: 16,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="생년월일 (예: 1999-01-01)"
                                                        placeholderTextColor="#9ca3af"
                                                        autoCapitalize="none"
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        hasError={!!errors.birthdate}
                                                        className="w-full pl-12 pr-4 py-3 text-base font-medium rounded-2xl"
                                                    />
                                                </View>
                                            </InputGroup>
                                            {errors.birthdate?.message && (
                                                <TextComponent className="text-red-500 text-xs mt-1 ml-1">
                                                    {errors.birthdate.message}
                                                </TextComponent>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* 비밀번호 입력 */}
                            <View className="mb-3">
                                <Label size="small">비밀번호</Label>
                                <Controller
                                    control={control}
                                    name={"password"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <InputGroup>
                                                <View className="relative justify-center flex-row items-center">
                                                    <Feather
                                                        name="lock"
                                                        size={20}
                                                        color="#9ca3af"
                                                        style={{
                                                            position: "absolute",
                                                            left: 16,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="비밀번호를 입력해주세요"
                                                        placeholderTextColor="#9ca3af"
                                                        secureTextEntry={!showPassword}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        hasError={!!errors.password}
                                                        className="w-full pl-12 pr-12 py-3 text-base font-medium rounded-2xl"
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setShowPassword(!showPassword)
                                                        }
                                                        className="absolute right-4 p-2">
                                                        <Feather
                                                            name={showPassword ? "eye" : "eye-off"}
                                                            size={20}
                                                            color="#9ca3af"
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </InputGroup>
                                            {errors.password?.message && (
                                                <TextComponent className="text-red-500 text-xs mt-1 ml-1">
                                                    {errors.password.message}
                                                </TextComponent>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* 비밀번호 확인 입력 */}
                            <View className="mb-3">
                                <Label size="small">비밀번호 확인</Label>
                                <Controller
                                    control={control}
                                    name={"confirmPassword"}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View>
                                            <InputGroup>
                                                <View className="relative justify-center flex-row items-center">
                                                    <Feather
                                                        name="lock"
                                                        size={20}
                                                        color="#9ca3af"
                                                        style={{
                                                            position: "absolute",
                                                            left: 16,
                                                            zIndex: 1,
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="비밀번호를 다시 입력해주세요"
                                                        placeholderTextColor="#9ca3af"
                                                        secureTextEntry={!showConfirmPassword}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        value={value}
                                                        hasError={!!errors.confirmPassword}
                                                        className="w-full pl-12 pr-12 py-3 text-base font-medium rounded-2xl"
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            setShowConfirmPassword(
                                                                !showConfirmPassword,
                                                            )
                                                        }
                                                        className="absolute right-4 p-2">
                                                        <Feather
                                                            name={
                                                                showConfirmPassword
                                                                    ? "eye"
                                                                    : "eye-off"
                                                            }
                                                            size={20}
                                                            color="#9ca3af"
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                            </InputGroup>
                                            {errors.confirmPassword?.message && (
                                                <TextComponent className="text-red-500 text-xs mt-1 ml-1">
                                                    {errors.confirmPassword.message}
                                                </TextComponent>
                                            )}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* 기타 Root 에러 메시지 */}
                            {errors.root?.message && (
                                <TextComponent className="text-red-500 text-sm text-center mb-2">
                                    {errors.root.message}
                                </TextComponent>
                            )}

                            {/* 가입하기 버튼 */}
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className={`mt-2 w-full py-3.5 rounded-2xl bg-primary-main items-center ${isSubmitting ? "opacity-60" : ""}`}>
                                {isSubmitting ? (
                                    <LoadingIndicator color="#ffffff" />
                                ) : (
                                    <TextComponent className="text-base font-bold text-white tracking-wide">
                                        가입하기
                                    </TextComponent>
                                )}
                            </TouchableOpacity>

                            {/* 로그인으로 돌아가기 */}
                            <View className="flex-row justify-center mt-4">
                                <TextComponent className="text-text-subtle text-sm">
                                    이미 계정이 있으신가요?
                                </TextComponent>
                                <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                                    <TextComponent className="text-primary-main text-sm font-bold ml-2">
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
