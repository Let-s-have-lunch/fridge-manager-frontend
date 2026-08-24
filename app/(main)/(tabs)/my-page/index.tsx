import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { User } from "@/types/user";
import userApi from "@/api/user/userApi";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { twMerge } from "tailwind-merge";
import { getAnimalIcon } from "@/constants/profile";
import { useSetupLayout } from "@/hooks/useSetupLayout";
import Button from "@/components/common/button/Button";

export default function MyPageScreen() {
    useSetupLayout({ showDesktopHeader: true });

    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const { logout, isLoggedIn } = useAuthStore();
    const { theme, onChangeTheme } = useThemeStore();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoggedIn) return;

            try {
                const userData = await userApi.getMyProfile();
                setUser(userData);
            } catch (error) {
                console.error("프로필 조회 실패:", error);
            }
        };

        fetchUserData().then(() => {});
    }, [isLoggedIn]);

    const handleLogout = async () => {
        try {
            logout();
            router.replace("/");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const handleToggleTheme = () => {
        if (onChangeTheme) {
            onChangeTheme();
        }
    };

    return (
        <View className="flex-1 bg-bg-default relative md:items-center md:justify-center">
            <ScrollView
                className="w-full flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}>
                <View className="w-full flex-1">
                    {/* 1. 프로필 영역 */}
                    <View className="mb-8">
                        <Card className="px-[20px] py-[20px]">
                            {isLoggedIn ? (
                                <View className="flex-row items-center gap-5 py-2">
                                    <View className="w-[84px] h-[84px] rounded-full border border-divider overflow-hidden items-center justify-center bg-bg-light">
                                        <Image
                                            source={getAnimalIcon(user?.id)}
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                            }}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    <View className="flex-1 justify-center">
                                        <TextComponent className="text-xl font-bold text-text-default">
                                            {user?.nickname || "로딩중..."}님
                                        </TextComponent>

                                        <TextComponent className="text-sm text-text-secondary mt-1">
                                            {user?.email || "정보를 불러오는 중입니다"}
                                        </TextComponent>
                                    </View>
                                </View>
                            ) : (
                                // 비회원 프로필
                                <TouchableOpacity
                                    className="flex-row items-center justify-between gap-5 py-2"
                                    activeOpacity={0.7}
                                    onPress={() => router.push("/auth/login")}>
                                    <View
                                        className={twMerge(
                                            "w-[84px] h-[84px] rounded-full border border-divider overflow-hidden items-center justify-center bg-bg-subtle",
                                        )}>
                                        <Feather name="user" size={40} color="#9CA3AF" />
                                    </View>

                                    <View className="flex-1 justify-center">
                                        <TextComponent className="text-xl font-bold text-text-default">
                                            로그인이 필요해요
                                        </TextComponent>

                                        <TextComponent className="text-[12px] text-text-secondary mt-1">
                                            스마트한 유통기한 관리로 식재료 폐기는 줄이고 소비
                                            효율을 높여보세요!
                                        </TextComponent>
                                    </View>

                                    <Feather name="chevron-right" size={24} color="#BDBDBD" />
                                </TouchableOpacity>
                            )}
                        </Card>
                    </View>

                    {/* 2. 나의 계정정보 */}
                    {isLoggedIn && (
                        <View className="mb-8 md:mb-12">
                            <TextComponent className="text-base font-bold text-text-default mb-3">
                                나의 계정정보
                            </TextComponent>

                            <View>
                                <TouchableOpacity
                                    onPress={() => router.push("/my-page/edit-profile")}
                                    className="flex-row items-center justify-between py-4 border-b border-divider">
                                    <TextComponent className="text-[15px] text-text-default">
                                        회원정보 수정
                                    </TextComponent>

                                    <Feather name="chevron-right" size={20} color="#BDBDBD" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => router.push("/my-page/change-password")}
                                    className="flex-row items-center justify-between py-4 border-b border-divider">
                                    <TextComponent className="text-[15px] text-text-default">
                                        비밀번호 수정
                                    </TextComponent>

                                    <Feather name="chevron-right" size={20} color="#BDBDBD" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* 3. 고객지원 */}
                    <View className="mb-8">
                        <TextComponent className="text-base font-bold text-text-default mb-3">
                            고객지원
                        </TextComponent>

                        <View>
                            <TouchableOpacity
                                onPress={() => router.push("/my-page/notice")}
                                className="flex-row items-center justify-between py-4 border-b border-divider">
                                <TextComponent className="text-[15px] text-text-default">
                                    공지사항
                                </TextComponent>

                                <Feather name="chevron-right" size={20} color="#BDBDBD" />
                            </TouchableOpacity>

                            {isLoggedIn && (
                                <TouchableOpacity
                                    onPress={() => router.push("/my-page/inquiries")}
                                    className="flex-row items-center justify-between py-4 border-b border-divider">
                                    <TextComponent className="text-[15px] text-text-default">
                                        1:1 문의
                                    </TextComponent>

                                    <Feather name="chevron-right" size={20} color="#BDBDBD" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* 4. 관리자 */}
                    {isLoggedIn && user?.role === "ADMIN" && (
                        <TouchableOpacity
                            onPress={() => router.push("/admin")}
                            activeOpacity={0.7}
                            className="mb-8 bg-bg-paper border border-divider rounded-xl p-4">
                            <TextComponent className="text-base font-bold text-text-default mb-1">
                                관리자 전용
                            </TextComponent>

                            <View className="flex-row items-center justify-between py-3">
                                <TextComponent className="text-[15px] font-bold text-primary-main">
                                    관리자 대시보드 바로가기
                                </TextComponent>

                                <Feather name="chevron-right" size={20} color="#BDBDBD" />
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* 5. 로그인 / 회원가입 / 로그아웃 */}
                    {isLoggedIn ? (
                        <View className="mt-8 md:mt-6">
                            <TouchableOpacity
                                onPress={handleLogout}
                                className="w-full py-4 bg-bg-subtle active:opacity-80 rounded-2xl items-center">
                                <TextComponent className="text-[15px] font-medium text-text-default">
                                    로그아웃
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View className="flex flex-col md:flex-row mt-8 md:mt-6 gap-3 w-full">
                            {/* 로그인 */}
                            <Button
                                fullWidth
                                size="medium"
                                color="primary"
                                variant="contained-square"
                                className="flex-1"
                                onPress={() => router.push("/auth/login")}>
                                로그인
                            </Button>

                            {/* 회원가입 */}

                            <Button
                                className={"border-primary-main"}
                                textClassName={"text-primary-main"}
                                wrap={true}
                                variant="outlined"
                                onPress={() => router.push("/auth/register")}>
                                회원가입
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* 테마 변경 플로팅 버튼 */}
            <View className="absolute top-0 h-full w-full pointer-events-none justify-end items-end pb-8 pr-2">
                <TouchableOpacity
                    onPress={handleToggleTheme}
                    activeOpacity={0.8}
                    className="w-14 h-14 items-center justify-center rounded-full bg-bg-paper border border-divider shadow-sm elevation-3 pointer-events-auto">
                    <Feather
                        name={theme === "light" ? "moon" : "sun"}
                        size={20}
                        color={theme === "light" ? "#444444" : "#F8F5F1"}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
