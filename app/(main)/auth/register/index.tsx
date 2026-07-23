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
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthRegisterPage() {
    const router = useRouter();

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

            // 웹과 모바일 환경에 따른 알림 및 라우팅 분기 처리
            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.replace("/auth/login");
            } else {
                Alert.alert("회원가입 완료", "회원가입에 성공했습니다! 로그인해 주세요.", [
                    {
                        text: "확인",
                        onPress: () => router.replace("/auth/login"),
                    },
                ]);
            }
        } catch (error) {
            console.log(error);

            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message || "오류가 발생했습니다.";

                // 409 중복 에러 등 백엔드 응답에 따른 필드별 에러 처리
                if (error.response.status === 409) {
                    if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
                    } else if (errorMessage.includes("이메일")) {
                        setError("email", { message: errorMessage });
                    } else {
                        setError("root", { message: errorMessage });
                    }
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
                {/* 헤더 영역 */}
                <View className="flex-row items-center px-4 py-3">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <Feather name="chevron-left" size={24} color="#444444" />
                    </TouchableOpacity>
                    <View className="flex-1 items-center pr-10">
                        <Text className="text-text-default text-lg font-bold">회원가입</Text>
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}>
                    {/* 상단 일러스트 및 타이틀 영역 */}
                    <View className="items-center mt-2 mb-8">
                        <View
                            className="relative items-center justify-center"
                            style={{
                                width: "92%", // 기존보다 훨씬 넓게
                                height: 270, // 높이도 충분히 확보
                            }}>
                            {/* 배경 */}
                            <View
                                style={{
                                    position: "absolute",
                                    width: "100%",
                                    height: 225,
                                    borderRadius: 55,
                                    backgroundColor: "#F3FCF6",
                                }}
                            />

                            {/* 냉장고 */}
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
                                    shadowOffset: {
                                        width: 0,
                                        height: 6,
                                    },
                                    elevation: 8,
                                }}>
                                <MaterialCommunityIcons
                                    name="fridge-outline"
                                    size={64}
                                    color="#10B981"
                                />
                            </View>

                            {/* Apple */}
                            <MaterialCommunityIcons
                                name="food-apple"
                                size={34}
                                color="#EF4444"
                                style={{
                                    position: "absolute",
                                    left: 45,
                                    top: 72,
                                }}
                            />

                            {/* Egg */}
                            <MaterialCommunityIcons
                                name="egg"
                                size={32}
                                color="#FBBF24"
                                style={{
                                    position: "absolute",
                                    right: 45,
                                    top: 66,
                                }}
                            />

                            {/* Carrot */}
                            <MaterialCommunityIcons
                                name="carrot"
                                size={32}
                                color="#F97316"
                                style={{
                                    position: "absolute",
                                    left: 82,
                                    bottom: 48,
                                }}
                            />

                            {/* Fish */}
                            <MaterialCommunityIcons
                                name="fish"
                                size={36}
                                color="#3B82F6"
                                style={{
                                    position: "absolute",
                                    right: 72,
                                    bottom: 44,
                                }}
                            />

                            {/* Leaf */}
                            <MaterialCommunityIcons
                                name="leaf"
                                size={18}
                                color="#78C98D"
                                style={{
                                    position: "absolute",
                                    top: 38,
                                    left: "47%",
                                }}
                            />

                            <MaterialCommunityIcons
                                name="leaf"
                                size={16}
                                color="#78C98D"
                                style={{
                                    position: "absolute",
                                    bottom: 22,
                                    right: "33%",
                                }}
                            />
                        </View>

                        <Text
                            className="text-center mt-3 text-[15px] leading-7 font-medium"
                            style={{ color: "#666" }}>
                            냉장고와 함께 더 건강한 식생활을{"\n"}
                            시작해보세요!
                        </Text>
                    </View>

                    {/* 폼 영역 */}
                    <View className="w-full">
                        {/* 1. 이름 (닉네임) */}
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
                                            className="flex-1 text-text-default text-base p-0"
                                            placeholder="이름을 입력해주세요"
                                            placeholderTextColor="#777777"
                                            autoCapitalize="none"
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    </View>
                                    {errors.nickname?.message && (
                                        <Text className="text-error-main text-sm mt-1 ml-4">
                                            {errors.nickname.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />

                        {/* 2. 이메일 */}
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

                        {/* 3. 비밀번호 */}
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

                        {/* 4. 비밀번호 확인 */}
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
                                            className="flex-1 text-text-default text-base p-0"
                                            placeholder="비밀번호를 다시 입력해주세요"
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
                                    {errors.confirmPassword?.message && (
                                        <Text className="text-error-main text-sm mt-1 ml-4">
                                            {errors.confirmPassword.message}
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

                        {/* 회원가입 버튼 */}
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className={`mt-4 rounded-full py-4 items-center justify-center ${isSubmitting ? "bg-primary-light" : "bg-primary-main"}`}>
                            <Text className="text-primary-contrast font-bold text-lg">
                                회원가입
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 하단 로그인 이동 링크 */}
                    <View className="flex-row justify-center items-center mt-10">
                        <Text className="text-text-secondary text-sm mr-2">
                            이미 계정이 있으신가요?
                        </Text>
                        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
                            <Text className="text-primary-main font-bold text-sm">로그인</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
