import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import userApi from "@/api/user/userApi";
import { isAxiosError } from "axios";
import {
    KeyboardAvoidingView,
    Platform,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSetupLayout } from "@/hooks/useSetupLayout";
import Input from "@/components/common/input/Input"; // 경로 확인

export default function ForgotPasswordPage() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        setError,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { email: "", newPassword: "", confirmPassword: "" },
    });

    const newPassword = watch("newPassword");

    const onSubmit = async (data: {
        email: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (data.newPassword !== data.confirmPassword) {
            setError("confirmPassword", { message: "비밀번호가 일치하지 않습니다." });
            return;
        }

        try {
            await userApi.resetPassword({ email: data.email, newPassword: data.newPassword });

            if (Platform.OS === "web") {
                window.alert("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
                router.replace("/auth/login");
            } else {
                Alert.alert("변경 완료", "비밀번호가 변경되었습니다. 로그인해주세요.", [
                    { text: "확인", onPress: () => router.replace("/auth/login") },
                ]);
            }
        } catch (error) {
            if (isAxiosError(error)) {
                setError("root", {
                    message: error.response?.data?.message || "오류가 발생했습니다.",
                });
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
                {/* 상단 뒤로가기 헤더 */}
                <View className="flex-row items-center px-4 py-3">
                    <TouchableOpacity onPress={() => router.back()} className="p-2">
                        <Feather name="chevron-left" size={24} color="#444444" />
                    </TouchableOpacity>
                </View>

                {/* contentContainerStyle에 justify-center를 주어 세로 중앙 정렬 */}
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        paddingHorizontal: 24,
                        paddingBottom: 40,
                    }}
                    showsVerticalScrollIndicator={false}>
                    {/* 타이틀 및 아이콘 */}
                    <View className="items-center mb-8">
                        <View className="w-16 h-16 mb-4 bg-bg-subtle rounded-full items-center justify-center">
                            <Text className="text-2xl">🔑</Text>
                        </View>
                        <Text className="text-text-default text-xl font-bold mb-2">
                            비밀번호 재설정
                        </Text>
                        <Text className="text-text-secondary text-sm text-center leading-5">
                            가입하신 이메일과 새로운 비밀번호를{"\n"}입력해주세요.
                        </Text>
                    </View>

                    {/* 폼 영역 */}
                    <View className="w-full">
                        {/* 1. 이메일 */}
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: "이메일을 입력해주세요." }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4 relative justify-center">
                                    {/* 아이콘을 absolute로 인풋 위에 띄움 */}
                                    <View className="absolute left-4 z-10">
                                        <Feather name="mail" size={20} color="#777777" />
                                    </View>
                                    <Input
                                        // pl-12: 아이콘과 텍스트 사이 여백 확보 / h-14: 인풋 높이 키움
                                        className="pl-12 h-14 text-base"
                                        placeholder="이메일을 입력해주세요"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        hasError={!!errors.email}
                                    />
                                </View>
                            )}
                        />

                        {/* 2. 새 비밀번호 */}
                        <Controller
                            control={control}
                            name="newPassword"
                            rules={{ required: "새 비밀번호를 입력해주세요." }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4 relative justify-center">
                                    <View className="absolute left-4 z-10">
                                        <Feather name="lock" size={20} color="#777777" />
                                    </View>
                                    <Input
                                        className="pl-12 h-14 text-base"
                                        placeholder="새 비밀번호 (6자 이상)"
                                        secureTextEntry={true}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        hasError={!!errors.newPassword}
                                    />
                                </View>
                            )}
                        />

                        {/* 3. 새 비밀번호 확인 */}
                        <Controller
                            control={control}
                            name="confirmPassword"
                            rules={{ required: "비밀번호 확인을 입력해주세요." }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="mb-4">
                                    <View className="relative justify-center">
                                        <View className="absolute left-4 z-10">
                                            <Feather name="lock" size={20} color="#777777" />
                                        </View>
                                        <Input
                                            className="pl-12 h-14 text-base"
                                            placeholder="새 비밀번호 확인"
                                            secureTextEntry={true}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                            hasError={!!errors.confirmPassword}
                                        />
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
                            <Text className="text-error-main text-center text-sm mt-2 mb-2">
                                {errors.root.message}
                            </Text>
                        )}

                        {/* 변경 버튼 */}
                        <TouchableOpacity
                            onPress={handleSubmit(onSubmit)}
                            disabled={isSubmitting}
                            className="mt-2 rounded-full py-4 items-center justify-center bg-primary-main">
                            <Text className="text-primary-contrast font-bold text-lg">
                                비밀번호 변경하기
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* 하단 로그인으로 돌아가기 링크 */}
                    <View className="flex-row justify-center items-center mt-8">
                        <Text className="text-text-secondary text-sm mr-2">
                            비밀번호가 생각나셨나요?
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