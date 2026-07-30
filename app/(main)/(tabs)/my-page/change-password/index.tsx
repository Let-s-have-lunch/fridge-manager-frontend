import { useState } from "react";
import { Alert, Platform, ScrollView, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import Label from "@/components/common/label/Label";
import userApi from "@/api/user/userApi";
import { updatePasswordSchema } from "@/schemas/user/changePasswordSchema";

export default function ChangePasswordPage() {
    const [prevPassword, setPrevPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [prevPasswordError, setPrevPasswordError] = useState<string | undefined>(undefined);
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [confirmPasswordError, setConfirmPasswordError] = useState<string | undefined>(undefined);

    const [showPrevPassword, setShowPrevPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSave = async () => {
        // 기존 에러 초기화
        setPrevPasswordError(undefined);
        setPasswordError(undefined);
        setConfirmPasswordError(undefined);

        // 프론트엔드 Zod 스키마 검증
        const result = updatePasswordSchema.safeParse({
            prevPassword,
            password,
            confirmPassword,
        });

        if (!result.success) {
            const fieldErrors = result.error.format();
            setPrevPasswordError(fieldErrors.prevPassword?._errors[0]);
            setPasswordError(fieldErrors.password?._errors[0]);
            setConfirmPasswordError(fieldErrors.confirmPassword?._errors[0]);
            return;
        }

        try {
            await userApi.changePassword(result.data);

            // ✅ 성공 시에만 상태창(알림창) 띄우고 이동
            const successMessage = "비밀번호가 성공적으로 변경되었습니다.";
            const handleSuccessMove = () => {
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.replace("/(tabs)/mypage");
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
            const errorResponse = error?.response?.data;

            // ❌ 실패 시에는 알림창 없이 인풋 아래에 빨간 글로 표시
            if (errorResponse?.errors && Array.isArray(errorResponse.errors)) {
                errorResponse.errors.forEach((err: { field: string; message: string }) => {
                    if (err.field === "prevPassword") {
                        setPrevPasswordError(err.message);
                    } else if (err.field === "password") {
                        setPasswordError(err.message);
                    } else if (err.field === "confirmPassword") {
                        setConfirmPasswordError(err.message);
                    }
                });
            } else if (errorResponse?.message) {
                const msg = errorResponse.message;
                if (
                    msg.includes("비밀번호") ||
                    msg.includes("현재") ||
                    msg.includes("일치") ||
                    msg.includes("틀렸")
                ) {
                    setPrevPasswordError(msg);
                } else {
                    setPasswordError(msg);
                }
            } else {
                setPrevPasswordError("비밀번호 변경에 실패했습니다. 다시 확인해주세요.");
            }
        }
    };

    return (
        <View className="flex-1 bg-bg-default">
            {/* 상단 타이틀 */}
            <View className="px-2 pt-4 pb-2">
                <Title title="비밀번호 변경" showBackButton onBackPress={() => router.back()} />
            </View>

            <ScrollView
                className="flex-1 px-6 pt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>
                {/* 현재 비밀번호 */}
                <View className="mb-5">
                    <Label size="small">현재 비밀번호</Label>
                    <InputGroup>
                        <View className="relative justify-center flex-row items-center">
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#9ca3af"
                                style={{ position: "absolute", left: 16, zIndex: 1 }}
                            />
                            <Input
                                value={prevPassword}
                                onChangeText={text => {
                                    setPrevPassword(text);
                                    if (text.trim()) setPrevPasswordError(undefined);
                                }}
                                placeholder="현재 비밀번호를 입력해주세요."
                                secureTextEntry={!showPrevPassword}
                                hasError={!!prevPasswordError}
                                className="w-full pl-12 pr-12 py-4 text-base font-medium rounded-2xl"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPrevPassword(!showPrevPassword)}
                                className="absolute right-4 p-2">
                                <Ionicons
                                    name={showPrevPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>
                        </View>
                    </InputGroup>
                    {prevPasswordError && (
                        <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                            {prevPasswordError}
                        </TextComponent>
                    )}
                </View>

                {/* 새 비밀번호 */}
                <View className="mb-5">
                    <Label size="small">새 비밀번호</Label>
                    <InputGroup>
                        <View className="relative justify-center flex-row items-center">
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#9ca3af"
                                style={{ position: "absolute", left: 16, zIndex: 1 }}
                            />
                            <Input
                                value={password}
                                onChangeText={text => {
                                    setPassword(text);
                                    if (text.length >= 6) setPasswordError(undefined);
                                }}
                                placeholder="새 비밀번호를 입력해주세요 (6자 이상)."
                                secureTextEntry={!showPassword}
                                hasError={!!passwordError}
                                className="w-full pl-12 pr-12 py-4 text-base font-medium rounded-2xl"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-4 p-2">
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>
                        </View>
                    </InputGroup>
                    {passwordError && (
                        <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                            {passwordError}
                        </TextComponent>
                    )}
                </View>

                {/* 새 비밀번호 확인 */}
                <View className="mb-5">
                    <Label size="small">새 비밀번호 확인</Label>
                    <InputGroup>
                        <View className="relative justify-center flex-row items-center">
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color="#9ca3af"
                                style={{ position: "absolute", left: 16, zIndex: 1 }}
                            />
                            <Input
                                value={confirmPassword}
                                onChangeText={text => {
                                    setConfirmPassword(text);
                                    if (text === password && text.length >= 6)
                                        setConfirmPasswordError(undefined);
                                }}
                                placeholder="새 비밀번호를 다시 입력해주세요."
                                secureTextEntry={!showConfirmPassword}
                                hasError={!!confirmPasswordError}
                                className="w-full pl-12 pr-12 py-4 text-base font-medium rounded-2xl"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 p-2">
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#9ca3af"
                                />
                            </TouchableOpacity>
                        </View>
                    </InputGroup>
                    {confirmPasswordError && (
                        <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                            {confirmPasswordError}
                        </TextComponent>
                    )}
                </View>

                {/* 변경하기 버튼 */}
                <TouchableOpacity
                    onPress={handleSave}
                    className="mt-8 w-full py-4 rounded-2xl bg-primary-main items-center">
                    <TextComponent className="text-base font-bold text-white tracking-wide">
                        변경하기
                    </TextComponent>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
