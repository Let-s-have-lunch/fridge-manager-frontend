import React, { useState, useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Image,
    ImageSourcePropType,
    Platform,
    ViewStyle,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { User } from "@/types/user";
import userApi from "@/api/user/userApi";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import { useThemeStore } from "@/stores/theme/useThemeStore";

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

    const handleToggleTheme = () => {
        if (onChangeTheme) {
            onChangeTheme();
        }
    };

    const themeButtonStyle: ViewStyle = {
        position: "absolute",
        right: 0, // ⬅️ 콘텐츠 패딩(px-6)과 우측 라인을 일치시킴
        bottom: 0, // ⬅️ 붕 뜨지 않도록 아래쪽으로 바짝 내림
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 4,
            },
            android: { elevation: 8 },
            web: { boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.12)" },
        }),
    };

    return (
        <View className="flex-1 bg-bg-default relative">
            {/* 콘텐츠 영역 */}
            <View className="px-6 pt-10 flex-1">
                {/* 프로필 영역 */}
                <View className="mb-8">
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

                {/* 나의 계정정보 리스트 */}
                <View className="mb-8">
                    <TextComponent className="text-base font-bold text-text-default mb-3">
                        나의 계정정보
                    </TextComponent>
                    <View>
                        <TouchableOpacity
                            onPress={() => router.push(`/(main)/mypage/edit-profile`)}
                            className="flex-row items-center justify-between py-4 border-b border-divider">
                            <TextComponent className="text-[15px] text-text-default">
                                회원정보 수정
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/mypage/change-password")}
                            className="flex-row items-center justify-between py-4 border-b border-divider">
                            <TextComponent className="text-[15px] text-text-default">
                                비밀번호 수정
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 고객지원 리스트 */}
                <View className="mb-8">
                    <TextComponent className="text-base font-bold text-text-default mb-3">
                        고객지원
                    </TextComponent>
                    <View>
                        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-divider">
                            <TextComponent className="text-[15px] text-text-default">
                                공지사항
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-divider">
                            <TextComponent className="text-[15px] text-text-default">
                                1:1 문의
                            </TextComponent>
                            <Feather name="chevron-right" size={20} color="#BDBDBD" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 로그아웃 버튼 */}
                <View className="mt-2 mb-16">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="w-full py-[18px] bg-bg-subtle active:opacity-80 rounded-[14px] items-center">
                        <TextComponent className="text-[15px] font-medium text-text-default">
                            로그아웃
                        </TextComponent>
                    </TouchableOpacity>
                </View>
            </View>

            {/* 🌙 테마 변경 버튼 */}
            <TouchableOpacity
                onPress={handleToggleTheme}
                style={themeButtonStyle}
                activeOpacity={0.8}>
                <Feather
                    name={theme === "light" ? "moon" : "sun"}
                    size={20}
                    color={theme === "light" ? "#333333" : "#FFD700"}
                />
            </TouchableOpacity>
        </View>
    );
}
