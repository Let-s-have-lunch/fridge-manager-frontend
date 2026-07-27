import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { User } from "@/types/user";
import userApi from "@/api/user/userApi";
import TextComponent from "@/components/common/text/TextComponent";
import Title from "@/components/common/title/Title";
import Card from "@/components/common/card/Card";

export default function MyPageScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

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

    return (
        <ScrollView className="flex-1 bg-bg-default px-5 py-6" showsVerticalScrollIndicator={false}>
            {/* 프로필 카드 */}
            <Card>
                <View className={twMerge(["flex-row", "items-center", "gap-4"])}>
                    <View
                        className={twMerge([
                            "w-14",
                            "h-14",
                            "rounded-full",
                            "bg-bg-light",
                            "items-center",
                            "justify-center",
                            "border",
                            "border-divider",
                        ])}>
                        <TextComponent className="text-xl">👤</TextComponent>
                    </View>

                    <View className="flex-1">
                        <TextComponent className="text-lg font-bold text-text-default">
                            {user?.nickname || "사용자"}
                        </TextComponent>
                        <TextComponent className="text-sm text-text-secondary mt-0.5">
                            {user?.email || "이메일 정보 없음"}
                        </TextComponent>
                    </View>
                </View>
            </Card>

            {/* 나의 계정정보 */}
            <View className="mt-6 mb-6">
                <Title className="mb-2">나의 계정정보</Title>

                <Card>
                    <TouchableOpacity
                        className={twMerge([
                            "flex-row",
                            "items-center",
                            "justify-between",
                            "py-3",
                            "border-b",
                            "border-divider",
                        ])}>
                        <TextComponent className="text-base font-medium text-text-default">
                            회원정보 수정
                        </TextComponent>
                        <Feather name="chevron-right" size={20} color="#777777" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={twMerge([
                            "flex-row",
                            "items-center",
                            "justify-between",
                            "py-3",
                        ])}>
                        <TextComponent className="text-base font-medium text-text-default">
                            비밀번호 수정
                        </TextComponent>
                        <Feather name="chevron-right" size={20} color="#777777" />
                    </TouchableOpacity>
                </Card>
            </View>

            {/* 고객지원 */}
            <View className="mb-6">
                <Title className="mb-2">고객지원</Title>
                <Card>
                    <TouchableOpacity
                        className={twMerge([
                            "flex-row",
                            "items-center",
                            "justify-between",
                            "py-3",
                            "border-b",
                            "border-divider",
                        ])}>
                        <TextComponent className="text-base font-medium text-text-default">
                            공지사항
                        </TextComponent>
                        <Feather name="chevron-right" size={20} color="#777777" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={twMerge([
                            "flex-row",
                            "items-center",
                            "justify-between",
                            "py-3",
                        ])}>
                        <TextComponent className="text-base font-medium text-text-default">
                            1:1 문의
                        </TextComponent>
                        <Feather name="chevron-right" size={20} color="#777777" />
                    </TouchableOpacity>
                </Card>
            </View>

            {/* 🛠️ TS2769 에러 해결: TouchableOpacity와 TextComponent 조합으로 안전하게 구현 */}
            <TouchableOpacity
                onPress={handleLogout}
                className={twMerge([
                    "w-full",
                    "py-4",
                    "bg-bg-light",
                    "active:opacity-80",
                    "rounded-2xl",
                    "items-center",
                    "mt-2",
                    "mb-10",
                ])}>
                <TextComponent className="text-base font-medium text-text-default">
                    로그아웃
                </TextComponent>
            </TouchableOpacity>
        </ScrollView>
    );
}
