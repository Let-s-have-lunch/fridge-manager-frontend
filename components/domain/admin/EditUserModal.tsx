import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    TextInput,
    TouchableOpacity,
    Platform,
    Alert,
    useColorScheme,
    ScrollView,
    KeyboardAvoidingView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextComponent from "@/components/common/text/TextComponent";
import adminApi from "@/api/admin/adminApi";
import { AdminUser } from "@/types/admin";
import { UpdateUserInputType, updateUserSchema } from "@/schemas/user/updateUserSchema";

interface EditUserModalProps {
    visible: boolean;
    user: AdminUser | null;
    onClose: () => void;
    onSuccess: () => void;
}

// 날짜 포맷팅 함수 (ISO 문자열에서 YYYYMMDD 추출)
const formatBirthdate = (dateStr?: string) => {
    if (!dateStr) return "";
    const onlyNums = dateStr.split("T")[0].replace(/[^0-9]/g, "");
    return onlyNums;
};

export default function EditUserModal({ visible, user, onClose, onSuccess }: EditUserModalProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [isLoading, setIsLoading] = useState(false);

    // React Hook Form 설정 (Zod 리졸버 및 실시간 검증 mode 추가)
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserInputType>({
        resolver: zodResolver(updateUserSchema),
        mode: "onChange", // ✅ 입력할 때마다 실시간으로 유효성 검사 실행
        defaultValues: {
            nickname: "",
            email: "",
            birthdate: "",
            password: "",
        },
    });

    // 모달이 열릴 때 유저 기존 정보로 폼 초기화
    useEffect(() => {
        if (user && visible) {
            reset({
                nickname: user.nickname || "",
                email: user.email || "",
                birthdate: formatBirthdate((user as any).birthdate),
                password: "",
            });
        }
    }, [user, visible, reset]);

    // 폼 제출 성공 시 실행될 함수
    const onSubmit = async (data: UpdateUserInputType) => {
        if (!user) return;

        try {
            setIsLoading(true);

            // API로 보낼 최종 데이터 조합
            const updateData: any = {
                nickname: data.nickname,
                email: data.email,
                birthdate: data.birthdate || "",
            };

            // 비밀번호가 입력된 경우에만 페이로드에 추가
            if (data.password && data.password.trim() !== "") {
                updateData.password = data.password;
            }

            await adminApi.updateUser(user.id, updateData);

            const successMsg = "회원 정보가 수정되었습니다.";
            Platform.OS === "web" ? window.alert(successMsg) : Alert.alert("성공", successMsg);

            onSuccess();
            onClose();
        } catch (error) {
            const errorMsg = "수정에 실패했습니다.";
            Platform.OS === "web" ? window.alert(errorMsg) : Alert.alert("오류", errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1">
                <View className="flex-1 justify-center items-center bg-black/50 px-5">
                    <View className="w-full max-w-sm bg-bg-paper rounded-2xl p-5 border border-divider max-h-[80%]">
                        {/* 모달 헤더 */}
                        <View className="flex-row justify-between items-center mb-5">
                            <TextComponent className="text-lg font-bold text-text-default">
                                회원 정보 수정
                            </TextComponent>
                            <TouchableOpacity onPress={onClose}>
                                <Feather
                                    name="x"
                                    size={24}
                                    color={isDark ? "#C9C1BA" : "#777777"}
                                />
                            </TouchableOpacity>
                        </View>

                        {/* 입력 폼 영역 */}
                        <ScrollView showsVerticalScrollIndicator={false} className="mb-5">
                            {/* 닉네임 입력 */}
                            <View className="mb-4">
                                <TextComponent className="text-sm font-bold text-text-secondary mb-2">
                                    닉네임
                                </TextComponent>
                                <Controller
                                    control={control}
                                    name="nickname"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            maxLength={10}
                                            className={`bg-bg-subtle border rounded-xl px-4 py-3 text-text-default ${
                                                errors.nickname
                                                    ? "border-red-500"
                                                    : "border-divider"
                                            }`}
                                            placeholder="닉네임을 입력하세요 (2~10자)"
                                            placeholderTextColor={isDark ? "#777777" : "#C9C1BA"}
                                        />
                                    )}
                                />
                                {errors.nickname && (
                                    <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                                        {errors.nickname.message}
                                    </TextComponent>
                                )}
                            </View>

                            {/* 이메일 입력 */}
                            <View className="mb-4">
                                <TextComponent className="text-sm font-bold text-text-secondary mb-2">
                                    이메일
                                </TextComponent>
                                <Controller
                                    control={control}
                                    name="email"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            className={`bg-bg-subtle border rounded-xl px-4 py-3 text-text-default ${
                                                errors.email ? "border-red-500" : "border-divider"
                                            }`}
                                            placeholder="example@email.com"
                                            placeholderTextColor={isDark ? "#777777" : "#C9C1BA"}
                                        />
                                    )}
                                />
                                {errors.email && (
                                    <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                                        {errors.email.message}
                                    </TextComponent>
                                )}
                            </View>

                            {/* 비밀번호 변경 입력 */}
                            <View className="mb-4">
                                <TextComponent className="text-sm font-bold text-text-secondary mb-2">
                                    비밀번호 변경
                                </TextComponent>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            value={value || ""}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry={true}
                                            className={`bg-bg-subtle border rounded-xl px-4 py-3 text-text-default ${
                                                errors.password
                                                    ? "border-red-500"
                                                    : "border-divider"
                                            }`}
                                            placeholder="변경할 경우에만 입력하세요 (6자 이상)"
                                            placeholderTextColor={isDark ? "#777777" : "#C9C1BA"}
                                        />
                                    )}
                                />
                                {errors.password && (
                                    <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                                        {errors.password.message}
                                    </TextComponent>
                                )}
                            </View>

                            {/* 생년월일 입력 */}
                            <View className="mb-2">
                                <TextComponent className="text-sm font-bold text-text-secondary mb-2">
                                    생년월일
                                </TextComponent>
                                <Controller
                                    control={control}
                                    name="birthdate"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            value={value || ""}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            maxLength={8}
                                            keyboardType="numeric"
                                            className={`bg-bg-subtle border rounded-xl px-4 py-3 text-text-default ${
                                                errors.birthdate
                                                    ? "border-red-500"
                                                    : "border-divider"
                                            }`}
                                            placeholder="YYYYMMDD (숫자 8자리)"
                                            placeholderTextColor={isDark ? "#777777" : "#C9C1BA"}
                                        />
                                    )}
                                />
                                {errors.birthdate && (
                                    <TextComponent className="text-red-500 text-xs mt-1.5 ml-1">
                                        {errors.birthdate.message}
                                    </TextComponent>
                                )}
                            </View>
                        </ScrollView>

                        {/* 하단 버튼 */}
                        <View className="flex-row gap-3 mt-2">
                            <TouchableOpacity
                                onPress={onClose}
                                className="flex-1 py-3 rounded-xl bg-bg-subtle border border-divider items-center">
                                <TextComponent className="font-bold text-text-secondary">
                                    취소
                                </TextComponent>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={isLoading}
                                className="flex-1 py-3 rounded-xl bg-primary-main items-center">
                                <TextComponent className="font-bold text-white">
                                    {isLoading ? "수정 중..." : "수정하기"}
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
