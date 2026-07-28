import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, ImageSourcePropType, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { User } from "@/types/user";
import userApi from "@/api/user/userApi";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useSetupLayout } from "@/hooks/useSetupLayout";

const ANIMAL_ICONS = [
    require("../../../../assets/images/dog.png"),
    require("../../../../assets/images/cat.png"),
    require("../../../../assets/images/rabbit.png"),
    require("../../../../assets/images/bear.png"),
    require("../../../../assets/images/hamster.png"),
    require("../../../../assets/images/fox.png"),
    require("../../../../assets/images/tiger.png"),
];

const getAnimalIcon = (id?: number): ImageSourcePropType => {
    if (!id) return ANIMAL_ICONS[0];
    const index = id % ANIMAL_ICONS.length;
    return ANIMAL_ICONS[index];
};

export default function MyPageScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    // 💡 날아갔던 부분 복구: 스토어에서 theme 상태와 변경 함수를 가져옵니다.
    const { theme, onChangeTheme } = useThemeStore();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await userApi.getMyProfile();
                setUser(userData);
            } catch (error) {
                console.error("프로필 조회 실패:", error);
            }
        };

        fetchUserData().then(() => {});
    }, []);

    const handleLogout = async () => {
        try {
            await userApi.logout();
            router.replace("/auth/login");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    // ✅ 테마 변경
    const handleToggleTheme = () => {
        if (onChangeTheme) {
            onChangeTheme();
        }
        console.log("현재 테마 :", theme);
    };

    return (
        <ScrollView className="flex-1 bg-bg-default px-6 pt-6 pb-8 relative">
            <View>
                {/* 1. 프로필 영역 */}
                <View className="mb-5">
                    <Card className="px-[20px] py-[20px]">
                        <View className="flex-row items-center gap-5 py-2">
                            <View className="w-[84px] h-[84px] rounded-full border border-divider overflow-hidden items-center justify-center bg-bg-light">
                                <Image
                                    source={getAnimalIcon(user?.id)}
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="contain"
                                />
                            </View>

                            <View className="flex-1 justify-center">
                                <TextComponent className="text-xl font-bold text-text-default">
                                    {user?.nickname || "철수"}님
                                </TextComponent>
                                <TextComponent className="text-sm text-text-secondary mt-1">
                                    {user?.email || "clover@gmail.com"}
                                </TextComponent>
                            </View>
                        </View>
                    </Card>
                </View>

                {/* 2. 나의 계정정보 리스트 */}
                <View className="mb-5">
                    <TextComponent className="text-base font-bold text-text-default mb-2">
                        나의 계정정보
                    </TextComponent>

                    <View>
                        <TouchableOpacity
                            onPress={() => router.push("/(main)/mypage/edit-profile")}
                            className="flex-row items-center justify-between py-3.5 border-b border-divider">
                            <TextComponent className="text-base text-text-default">
                                회원정보 수정
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between py-3.5 border-b border-divider">
                            <TextComponent className="text-base text-text-default">
                                비밀번호 수정
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 3. 고객지원 리스트 */}
                <View className="mb-5">
                    <TextComponent className="text-base font-bold text-text-default mb-2">
                        고객지원
                    </TextComponent>

                    <View>
                        <TouchableOpacity className="flex-row items-center justify-between py-3.5 border-b border-divider">
                            <TextComponent className="text-base text-text-default">
                                공지사항
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between py-3.5 border-b border-divider">
                            <TextComponent className="text-base text-text-default">
                                1:1 문의
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 4. 로그아웃 버튼 */}
                <View className="mt-[20px]">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="w-full py-4 bg-[#F2EFE8] active:opacity-80 rounded-2xl items-center">
                        <TextComponent className="text-[15px] font-medium text-text-default">
                            로그아웃
                        </TextComponent>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 테마 변경 버튼 */}
            <TouchableOpacity
                onPress={handleToggleTheme}
                className="absolute w-12 h-12 bg-white rounded-full border border-divider items-center justify-center shadow-sm active:opacity-80 z-10"
                style={{
                    right: -8,
                    bottom: -15,
                    elevation: 4,
                }}>
                <Feather
                    name={theme === "light" ? "moon" : "sun"}
                    size={20}
                    color={theme === "light" ? "#333333" : "#FFD700"}
                />
            </TouchableOpacity>
        </ScrollView>
    );
}