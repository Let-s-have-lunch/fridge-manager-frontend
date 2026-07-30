import { useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import userApi from "@/api/user/userApi";
import Label from "@/components/common/label/Label";

export default function EditProfilePage() {
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");

    // 💡 초기값을 undefined로 설정하여 텍스트 노드 에러 방지
    const [nicknameError, setNicknameError] = useState<string | undefined>(undefined);

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
            {/* 상단 타이틀 영역 */}
            <View className="px-2 pt-4 pb-2">
                <Title title="회원정보 수정" showBackButton onBackPress={() => router.back()} />
            </View>

            <ScrollView
                className="flex-1 px-6 pt-4"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}>
                {/* 닉네임 */}
                <View className="mb-5">
                    <Label size="small">닉네임</Label>
                    <InputGroup errorMessage={nicknameError}>
                        <Input
                            value={nickname}
                            onChangeText={text => {
                                setNickname(text);
                                if (text) setNicknameError(undefined);
                            }}
                            placeholder="닉네임을 입력해주세요."
                            hasError={!!nicknameError}
                            // 💡 좌우 여백(px-5), 상하 여백(py-4), 글꼴 크기 및 굵기 추가
                            className="px-5 py-4 text-base font-medium rounded-2xl"
                        />
                    </InputGroup>
                </View>

                {/* 이메일 */}
                <View className="mb-5">
                    <Label size="small">이메일</Label>
                    <InputGroup>
                        <Input
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholder="이메일을 입력해주세요."
                            // 💡 스타일 동일하게 적용
                            className="px-5 py-4 text-base font-medium rounded-2xl"
                        />
                    </InputGroup>
                </View>

                {/* 생년월일 */}
                <View className="mb-5">
                    <Label size="small">생년월일</Label>
                    <InputGroup>
                        <Input
                            value={birthdate}
                            onChangeText={setBirthdate}
                            placeholder="YYYY-MM-DD"
                            // 💡 스타일 동일하게 적용
                            className="px-5 py-4 text-base font-medium rounded-2xl"
                        />
                    </InputGroup>
                </View>

                {/* 저장 버튼 */}
                <TouchableOpacity
                    onPress={handleSave}
                    className="mt-8 w-full py-4 rounded-2xl bg-primary-main items-center">
                    <TextComponent className="text-base font-bold text-white tracking-wide">
                        저장하기
                    </TextComponent>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
