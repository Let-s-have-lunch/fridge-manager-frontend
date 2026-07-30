import { useEffect } from "react";
import { Alert, Platform, ScrollView, TouchableOpacity, View } from "react-native";

import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import userApi from "@/api/user/userApi";
import { UpdateUserInputType, updateUserSchema } from "@/schemas/user/updateUserSchema";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { isAxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import ErrorMessage from "@/components/common/label/ErrorMessage";
import { twMerge } from "tailwind-merge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";

export default function EditProfilePage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserInputType>({
        resolver: zodResolver(updateUserSchema),
        mode: "onTouched",
        defaultValues: {
            nickname: "",
            birthdate: "",
        },
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getMyProfile();

                let formattedBirthdate = "";

                if (data.birthdate) {
                    formattedBirthdate = data.birthdate.substring(0, 10).replace(/-/g, "");
                } else {
                    formattedBirthdate = "";
                }

                reset({
                    nickname: data.nickname,
                    birthdate: formattedBirthdate,
                });
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile().then(() => {});
    }, [reset]);

    const handleSave = async (data: UpdateUserInputType) => {
        try {
            const { nickname, birthdate } = data;
            let formattedBirthdate;
            if (birthdate && birthdate.length === 8) {
                const year = birthdate.slice(0, 4);
                const month = birthdate.slice(4, 6);
                const day = birthdate.slice(6, 8);

                formattedBirthdate = `${year}-${month}-${day}T00:00:00Z`;
            } else {
                formattedBirthdate = undefined;
            }

            const result = await userApi.updateUser({ nickname, birthdate: formattedBirthdate });
            useAuthStore.setState({ user: result });

            if (Platform.OS === "web") {
                alert("회원정보가 성공적으로 수정되었습니다.");
                router.push("/my-page");
            } else {
                Alert.alert("수정 완료", "회원정보가 성공적으로 수정되었습니다.", [
                    { text: "확인", onPress: () => router.push("/my-page") },
                ]);
            }
        } catch (error) {
            console.log(error);
            if (isAxiosError(error) && error.response) {
                const errorMessage = error.response.data.message;
                if (error.response.status === 409) {
                    if (errorMessage.includes("닉네임")) {
                        setError("nickname", { message: errorMessage });
                    }
                    return;
                }
                setError("root", { message: errorMessage });
            } else {
                setError("root", { message: "알수 없는 오류가 발생했습니다." });
            }
        }
    };

    return (
        <View className="flex-1 bg-bg-default">
            {/* 상단 타이틀 영역 */}
            <View className="px-2 pt-4 pb-2">
                <Title title="회원정보 수정" showBackButton onBackPress={() => router.back()} />
            </View>

            <ScrollView
                className="flex-1 px-6 pt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>
                {/* 닉네임 */}
                <Controller
                    control={control}
                    name={"nickname"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <InputGroup
                                label={"닉네임"}
                                placeholder={"닉네임을 입력해주세요."}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.nickname?.message}
                            />
                        );
                    }}
                />

                {/* 생년월일 */}
                <Controller
                    control={control}
                    name={"birthdate"}
                    render={({ field: { onChange, onBlur, value } }) => {
                        return (
                            <InputGroup
                                size={"small"}
                                id={"birthdate"}
                                label={"생년월일"}
                                placeholder={"YYYYMMDD"}
                                keyboardType={"number-pad"}
                                maxLength={8}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.birthdate?.message}
                            />
                        );
                    }}
                />

                {errors.root?.message && (
                    <ErrorMessage className={twMerge("text-center", "mt-2", "mb-4")}>
                        {errors.root?.message}
                    </ErrorMessage>
                )}

                {/* 저장 버튼 */}
                <TouchableOpacity
                    disabled={isSubmitting}
                    onPress={handleSubmit(handleSave)}
                    className="mt-8 w-full py-4 rounded-2xl bg-primary-main items-center">
                    <TextComponent className="text-base font-bold text-white tracking-wide">
                        저장하기
                    </TextComponent>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
