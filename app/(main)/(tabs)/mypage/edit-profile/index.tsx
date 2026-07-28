import { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import userApi from "@/api/user/userApi";

export default function EditProfilePage() {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");

    // 에러 상태 관리 (이미지의 빨간색 에러 UI를 닉네임에 적용해보기 위한 예시)
    const [nicknameError, setNicknameError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getMyProfile();

                setNickname(data.nickname ?? "");
                setEmail(data.email ?? "");
                setBirthdate(
                    data.birthdate ? new Date(data.birthdate).toISOString().split("T")[0] : "",
                );
            } catch (error) {
                console.error(error);
            }
        };

        fetchProfile().then(() => {});
    }, []);

    const handleSave = async () => {
        // 유효성 검사 예시 (닉네임이 비어있으면 에러 띄우기)
        if (!nickname.trim()) {
            setNicknameError("닉네임을 입력해주세요.");
            return;
        }

        try {
            await userApi.updateUser({
                nickname,
                email,
                birthdate,
            });

            Alert.alert("알림", "회원정보가 수정되었습니다.");
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert("오류", "회원정보 수정에 실패했습니다.");
        }
    };

    return (
        <View className="flex-1 bg-bg-default">
            {/* 작성해주신 Title 컴포넌트 완벽하게 적용됨 */}
            <View className="px-2 pt-4 pb-2">
                <Title title="회원정보 수정" showBackButton onBackPress={() => router.back()} />
            </View>

            <ScrollView
                className="flex-1 px-6 pt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>
                {/* 닉네임 (에러 상태 처리 포함) */}
                <InputGroup label="닉네임" errorMessage={nicknameError}>
                    <Input
                        value={nickname}
                        onChangeText={text => {
                            setNickname(text);
                            if (text) setNicknameError(""); // 입력하면 에러 메시지 사라짐
                        }}
                        placeholder="닉네임을 입력해주세요."
                        hasError={!!nicknameError} // 에러 시 빨간 테두리
                    />
                </InputGroup>

                {/* 이메일 */}
                <InputGroup label="이메일">
                    <Input
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholder="이메일을 입력해주세요."
                    />
                </InputGroup>

                {/* 생년월일 */}
                <InputGroup label="생년월일">
                    <Input value={birthdate} onChangeText={setBirthdate} placeholder="YYYY-MM-DD" />
                </InputGroup>

                {/* 저장 버튼 */}
                <TouchableOpacity
                    onPress={handleSave}
                    className="mt-8 w-full py-4 rounded-2xl bg-primary-main items-center">
                    <TextComponent className="text-base font-semibold text-white">
                        저장하기
                    </TextComponent>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
