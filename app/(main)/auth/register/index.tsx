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
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";

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
                        {/* 백버튼을 제거하고 타이틀을 중앙에 깔끔하게 배치 */}
                        <View className="items-center py-4 mt-2">
                            <Title
                                title="회원가입"
                                className="text-text-default text-lg font-bold"
                            />
                        </View>

                        <View className="items-center mt-2 mb-8">
                            <View
                                className="relative items-center justify-center"
                                style={{ width: "92%", height: 270 }}>
                                <View
                                    style={{
                                        position: "absolute",
                                        width: "100%",
                                        height: 225,
                                        borderRadius: 55,
                                        backgroundColor: "#F3FCF6",
                                    }}
                                />
                                <View
                                    style={{
                                        width: 120,
                                        height: 120,
                                        borderRadius: 30,
                                        backgroundColor: "#ECFDF5",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        shadowColor: "#000",
                                        shadowOpacity: 0.18,
                                        shadowRadius: 12,
                                        shadowOffset: { width: 0, height: 6 },
                                        elevation: 8,
                                    }}>
                                    <MaterialCommunityIcons
                                        name="fridge-outline"
                                        size={64}
                                        color="#10B981"
                                    />
                                </View>
                                <MaterialCommunityIcons
                                    name="food-apple"
                                    size={34}
                                    color="#EF4444"
                                    style={{ position: "absolute", left: 45, top: 72 }}
                                />
                                <MaterialCommunityIcons
                                    name="egg"
                                    size={32}
                                    color="#FBBF24"
                                    style={{ position: "absolute", right: 45, top: 66 }}
                                />
                                <MaterialCommunityIcons
                                    name="carrot"
                                    size={32}
                                    color="#F97316"
                                    style={{ position: "absolute", left: 82, bottom: 48 }}
                                />
                                <MaterialCommunityIcons
                                    name="fish"
                                    size={36}
                                    color="#3B82F6"
                                    style={{ position: "absolute", right: 72, bottom: 44 }}
                                />
                                <MaterialCommunityIcons
                                    name="leaf"
                                    size={18}
                                    color="#78C98D"
                                    style={{ position: "absolute", top: 38, left: "47%" }}
                                />
                                <MaterialCommunityIcons
                                    name="leaf"
                                    size={16}
                                    color="#78C98D"
                                    style={{ position: "absolute", bottom: 22, right: "33%" }}
                                />
                            </View>
                            <TextComponent
                                className="text-center mt-3 text-[15px] leading-7 font-medium"
                                style={{ color: "#666" }}>
                                냉장고와 함께 더 건강한 식생활을{"\n"}시작해보세요!
                            </TextComponent>
                        </View>

                        <View className="w-full">
                            <Controller
                                control={control}
                                name={"nickname"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="mb-4">
                                        <View
                                            className={`flex-row items-center border ${errors.nickname ? "border-error-main" : "border-divider"} rounded-full px-5 py-4 bg-transparent`}>
                                            <Feather
                                                name="user"
                                                size={20}
                                                color="#777777"
                                                className="mr-3"
                                            />
                                            <TextInput
                                                className="flex-1 text-text-default text-base p-0 outline-none"
                                                placeholder="이름을 입력해주세요"
                                                placeholderTextColor="#777777"
                                                autoCapitalize="none"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </View>
                                        {errors.nickname?.message && (
                                            <TextComponent className="text-error-main text-sm mt-1 ml-4">
                                                {errors.nickname.message}
                                            </TextComponent>
                                        )}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name={"email"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="mb-4">
                                        <View
                                            className={`flex-row items-center border ${errors.email ? "border-error-main" : "border-divider"} rounded-full px-5 py-4 bg-transparent`}>
                                            <Feather
                                                name="mail"
                                                size={20}
                                                color="#777777"
                                                className="mr-3"
                                            />
                                            <TextInput
                                                className="flex-1 text-text-default text-base p-0 outline-none"
                                                placeholder="이메일을 입력해주세요"
                                                placeholderTextColor="#777777"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                        </View>
                                        {errors.email?.message && (
                                            <TextComponent className="text-error-main text-sm mt-1 ml-4">
                                                {errors.email.message}
                                            </TextComponent>
                                        )}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name={"password"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="mb-4">
                                        <View
                                            className={`flex-row items-center border ${errors.password ? "border-error-main" : "border-divider"} rounded-full px-5 py-4 bg-transparent`}>
                                            <Feather
                                                name="lock"
                                                size={20}
                                                color="#777777"
                                                className="mr-3"
                                            />
                                            <TextInput
                                                className="flex-1 text-text-default text-base p-0 outline-none"
                                                placeholder="비밀번호를 입력해주세요"
                                                placeholderTextColor="#777777"
                                                secureTextEntry={!showPassword}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}>
                                                <Feather
                                                    name={showPassword ? "eye" : "eye-off"}
                                                    size={20}
                                                    color="#777777"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {errors.password?.message && (
                                            <TextComponent className="text-error-main text-sm mt-1 ml-4">
                                                {errors.password.message}
                                            </TextComponent>
                                        )}
                                    </View>
                                )}
                            />

                            <Controller
                                control={control}
                                name={"confirmPassword"}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <View className="mb-4">
                                        <View
                                            className={`flex-row items-center border ${errors.confirmPassword ? "border-error-main" : "border-divider"} rounded-full px-5 py-4 bg-transparent`}>
                                            <Feather
                                                name="lock"
                                                size={20}
                                                color="#777777"
                                                className="mr-3"
                                            />
                                            <TextInput
                                                className="flex-1 text-text-default text-base p-0 outline-none"
                                                placeholder="비밀번호를 다시 입력해주세요"
                                                placeholderTextColor="#777777"
                                                secureTextEntry={!showConfirmPassword}
                                                onBlur={onBlur}
                                                onChangeText={onChange}
                                                value={value}
                                            />
                                            <TouchableOpacity
                                                onPress={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }>
                                                <Feather
                                                    name={showConfirmPassword ? "eye" : "eye-off"}
                                                    size={20}
                                                    color="#777777"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        {errors.confirmPassword?.message && (
                                            <TextComponent className="text-error-main text-sm mt-1 ml-4">
                                                {errors.confirmPassword.message}
                                            </TextComponent>
                                        )}
                                    </View>
                                )}
                            />

                            {errors.root?.message && (
                                <TextComponent className="text-error-main text-center text-sm mt-2">
                                    {errors.root.message}
                                </TextComponent>
                            )}

                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                                className={`mt-4 rounded-full py-4 items-center justify-center ${isSubmitting ? "bg-primary-light" : "bg-primary-main"}`}>
                                {isSubmitting ? (
                                    <LoadingIndicator />
                                ) : (
                                    <TextComponent className="text-primary-contrast font-bold text-lg">
                                        회원가입
                                    </TextComponent>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-center items-center mt-auto pt-10">
                            <TextComponent className="text-text-secondary text-sm mr-2">
                                이미 계정이 있으신가요?
                            </TextComponent>
                            <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                                <TextComponent className="text-primary-main font-bold text-sm">
                                    로그인
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
