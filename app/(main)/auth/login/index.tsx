import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { LoginUserInputType, loginUserSchema } from "@/schemas/user/loginUserSchema";
import userApi from "@/api/user/userApi";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthLoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();

    const [keepLoggedIn, setKeepLoggedIn] = useState(false);

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

            // 웹과 모바일 환경에 따른 알림 및 라우팅 분기 처리
            if (Platform.OS === "web") {
                window.alert("로그인에 성공했습니다.");
                router.replace("/");
            } else {
                Alert.alert("로그인 성공", "로그인에 성공했습니다.", [
                    {
                        text: "확인",
                        onPress: () => router.replace("/"),
                    },
                ]);
            }
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data.message || "로그인 중 오류가 발생했습니다.";

                // 400 또는 401 등 인증 에러 처리
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

    return (
        <SafeAreaView className="flex-1 bg-bg-default">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}>
                    {/* 상단 일러스트 및 타이틀 영역 */}
                    <View className="items-center mt-20 mb-12">
                        {/* TODO: 실제 대파 일러스트 이미지 에셋으로 교체 필요 */}
                        <Text className="text-5xl mb-4">🧅</Text>
                        <Text className="text-text-default text-lg font-bold mb-2">냉장고</Text>
                        <Text className="text-text-default text-2xl font-bold mb-3">
                            안녕하세요! 🎉
                        </Text>
                        <Text className="text-text-secondary text-[15px] text-center leading-6">
                            신선한 식재료를{"\n"}더 오래 관리해보세요.
                        </Text>
                    </View>

                    {/* 폼 영역 */}
                    <View className="w-full">
                        {/* 1. 이메일 */}
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
                                            className="flex-1 text-text-default text-base p-0"
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
                                        <Text className="text-error-main text-sm mt-1 ml-4">
                                            {errors.email.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        {/* 2. 비밀번호 */}
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
                                            className="flex-1 text-text-default text-base p-0"
                                            placeholder="비밀번호를 입력해주세요"
                                            placeholderTextColor="#777777"
                                            secureTextEntry={true}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                        <TouchableOpacity>
                                            <Feather name="eye-off" size={20} color="#777777" />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.password?.message && (
                                        <Text className="text-error-main text-sm mt-1 ml-4">
                                            {errors.password.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        {errors.root?.message && (
                            <Text className="text-error-main text-center text-sm mt-2">
                                {errors.root.message}
                            </Text>
                        )}

                        {/* 옵션: 로그인 상태 유지 & 비밀번호 찾기 */}
                        <View className="flex-row justify-between items-center mt-2 mb-8 px-2">
                            <TouchableOpacity
                                className="flex-row items-center"
                                onPress={() => setKeepLoggedIn(!keepLoggedIn)}
                                activeOpacity={0.7}>
                                <View
                                    className={`w-5 h-5 border rounded items-center justify-center mr-2 ${keepLoggedIn ? "bg-primary-main border-primary-main" : "border-divider bg-transparent"}`}>
                                    {keepLoggedIn && (
                                        <Feather name="check" size={14} color="white" />
                                    )}
                                </View>
                                <Text className="text-text-secondary text-sm">
                                    로그인 상태 유지
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
                                <Text className="text-error-point text-sm font-bold">
                                    비밀번호 찾기
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className={`rounded-full py-4 items-center justify-center ${isSubmitting ? "bg-primary-light" : "bg-primary-main"}`}>
                            <Text className="text-primary-contrast font-bold text-lg">로그인</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center items-center mt-auto pt-10">
                        <Text className="text-text-secondary text-sm mr-2">계정이 없으신가요?</Text>
                        <TouchableOpacity onPress={() => router.push("/(main)/auth/register")}>
                            <Text className="text-error-point font-bold text-sm">회원가입</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
