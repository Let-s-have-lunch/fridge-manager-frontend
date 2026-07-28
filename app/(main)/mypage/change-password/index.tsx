import { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import Label from "@/components/common/label/Label";
import userApi from "@/api/user/userApi";

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
        let isValid = true;

        if (!prevPassword.trim()) {
            setPrevPasswordError("현재 비밀번호를 입력해주세요.");
            isValid = false;
        } else {
            setPrevPasswordError(undefined);
        }

        if (!password.trim()) {
            setPasswordError("새 비밀번호를 입력해주세요.");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("비밀번호는 6글자 이상이어야 합니다.");
            isValid = false;
        } else {
            setPasswordError(undefined);
        }

        // 3. 새 비밀번호 확인 검사
        if (!confirmPassword.trim()) {
            setConfirmPasswordError("비밀번호 확인은 6글자 이상이어야 합니다.");
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError("비밀번호 확인이 일치하지 않습니다.");
            isValid = false;
        } else {
            setConfirmPasswordError(undefined);
        }

        if (!isValid) return;

        try {
            // 💡 백엔드 스키마가 요구하는 정확한 키값으로 전송
            await userApi.changePassword({
                prevPassword,
                password,
                confirmPassword,
            });

            Alert.alert("알림", "비밀번호가 성공적으로 변경되었습니다.");
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("오류", "비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.");
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
