import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import { DashboardSummaryResponse } from "@/types/admin";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import adminUserApi from "@/api/admin/adminUserApi";

export default function AdminDashboard() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await adminUserApi.getSummary(); // ✅ adminUserApi로 호출
                setSummary(data);
            } catch (error) {
                console.error("대시보드 데이터 조회 실패:", error);
                Alert.alert("오류", "대시보드 데이터를 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData().then(() => {});
    }, []);

    return (
        /* 웹에서 너무 넓어지지 않도록 중앙 정렬 및 최대 너비(max-w-md) 적용 */
        <View className="flex-1 items-center bg-bg-default">
            <View className="w-full flex-1 ">
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* 웰컴 배너 카드 */}
                    <Card className="p-5 mb-5 bg-bg-paper border border-divider rounded-2xl md:hidden">
                        <View className="flex-col">
                            <TextComponent className="text-[16px] font-semibold text-text-default">
                                관리자 시스템
                            </TextComponent>
                            <TextComponent className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                                회원, 공지사항 및 1:1 문의를 통합 관리하세요.
                            </TextComponent>
                        </View>
                    </Card>

                    {/* 빠른 메뉴 바로가기 */}
                    <View className="mb-6 md:hidden">
                        <TextComponent className="text-base font-bold text-text-default mb-3 px-1">
                            바로가기 메뉴
                        </TextComponent>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => router.push("/admin/users")}
                                className="flex-1 bg-bg-paper p-4 rounded-2xl border border-divider items-center justify-center active:opacity-70">
                                <View className="w-11 h-11 bg-blue-500/15 dark:bg-blue-500/25 rounded-xl items-center justify-center mb-2 border border-blue-500/30">
                                    <Feather
                                        name="users"
                                        size={20}
                                        color={isDark ? "#60A5FA" : "#2563EB"}
                                    />
                                </View>
                                <TextComponent className="font-bold text-text-default text-xs text-center">
                                    회원 관리
                                </TextComponent>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/admin/notices")}
                                className="flex-1 bg-bg-paper p-4 rounded-2xl border border-divider items-center justify-center active:opacity-70">
                                <View className="w-11 h-11 bg-amber-500/15 dark:bg-amber-500/25 rounded-xl items-center justify-center mb-2 border border-amber-500/30">
                                    <Feather
                                        name="bell"
                                        size={20}
                                        color={isDark ? "#FBBF24" : "#D97706"}
                                    />
                                </View>
                                <TextComponent className="font-bold text-text-default text-xs text-center">
                                    공지사항
                                </TextComponent>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push("/admin/inquiries")}
                                className="flex-1 bg-bg-paper p-4 rounded-2xl border border-divider items-center justify-center active:opacity-70">
                                <View className="w-11 h-11 bg-emerald-500/15 dark:bg-emerald-500/25 rounded-xl items-center justify-center mb-2 border border-emerald-500/30">
                                    <Feather
                                        name="message-square"
                                        size={20}
                                        color={isDark ? "#34D399" : "#059669"}
                                    />
                                </View>
                                <TextComponent className="font-bold text-text-default text-xs text-center">
                                    1:1 문의
                                </TextComponent>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 최근 가입 유저 리스트 */}
                    <View className="mb-8">
                        <View className="mb-3 px-1">
                            <TextComponent className="text-base font-bold text-text-default">
                                최근 가입 유저
                            </TextComponent>
                        </View>

                        <Card className="px-0 py-1 rounded-2xl border border-divider overflow-hidden bg-bg-paper">
                            {isLoading ? (
                                <View className="py-12 items-center justify-center">
                                    <LoadingIndicator />
                                </View>
                            ) : !summary || summary.recentUsers.length === 0 ? (
                                <View className="py-12 items-center justify-center">
                                    <TextComponent className="text-text-secondary text-sm">
                                        최근 가입한 유저가 없습니다.
                                    </TextComponent>
                                </View>
                            ) : (
                                summary.recentUsers.map((user, index) => (
                                    <View
                                        key={user.id}
                                        className={`flex-row items-center justify-between px-5 py-4 ${
                                            index !== summary.recentUsers.length - 1
                                                ? "border-b border-divider"
                                                : ""
                                        }`}>
                                        <View className="flex-row items-center gap-3.5">
                                            <View className="w-10 h-10 rounded-full bg-bg-subtle items-center justify-center border border-divider">
                                                <Feather
                                                    name="user"
                                                    size={18}
                                                    color={isDark ? "#F79C79" : "#EF7D6D"}
                                                />
                                            </View>
                                            <View>
                                                <TextComponent className="font-bold text-text-default text-[15px]">
                                                    {user.nickname}
                                                </TextComponent>
                                                <TextComponent className="text-xs text-text-secondary mt-0.5">
                                                    {user.email}
                                                </TextComponent>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <View
                                                className={`px-2.5 py-0.5 rounded-full mb-1 ${
                                                    user.role === "ADMIN"
                                                        ? "bg-primary-main"
                                                        : "bg-bg-subtle border border-divider"
                                                }`}>
                                                <TextComponent
                                                    className={`text-[10px] font-bold ${
                                                        user.role === "ADMIN"
                                                            ? "text-white"
                                                            : "text-text-secondary"
                                                    }`}>
                                                    {user.role}
                                                </TextComponent>
                                            </View>
                                            <TextComponent className="text-[10px] text-text-secondary">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TextComponent>
                                        </View>
                                    </View>
                                ))
                            )}
                        </Card>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
