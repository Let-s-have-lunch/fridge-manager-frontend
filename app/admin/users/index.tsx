import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Alert, useColorScheme, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import Card from "@/components/common/card/Card";
import adminApi from "@/api/admin/adminApi";
import { AdminUser } from "@/types/admin";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import EditUserModal from "@/components/domain/admin/EditUserModal";

export default function AdminUserManagement() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ 모달 상태 관리를 위한 state 추가
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // 회원 목록 불러오기
    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await adminApi.getUserList(1, 20);
            setUsers(response.list);
            setTotalCount(response.total);
        } catch (error) {
            console.error("회원 목록 조회 실패:", error);
            if (Platform.OS === "web") {
                window.alert("회원 목록을 불러오지 못했습니다.");
            } else {
                Alert.alert("오류", "회원 목록을 불러오지 못했습니다.");
            }
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers().then(() => {});
    }, []);

    // 1. 회원 상세 정보 확인 (GET /admin/user/:id 연동)
    const handleViewDetail = async (userId: number) => {
        try {
            const detail: AdminUser = await adminApi.getUserDetail(userId);
            const message = `ID: ${detail.id}\n닉네임: ${detail.nickname}\n이메일: ${detail.email}\n권한: ${detail.role}\n가입일: ${new Date(detail.createdAt).toLocaleDateString()}`;

            if (Platform.OS === "web") {
                window.alert(message);
                return;
            }

            Alert.alert("회원 상세 정보", message, [{ text: "확인" }]);
        } catch (error) {
            console.log(error);
            if (Platform.OS === "web") {
                window.alert("회원 상세 정보를 불러오지 못했습니다.");
                return;
            }
            Alert.alert("오류", "회원 상세 정보를 불러오지 못했습니다.");
        }
    };

    // 2. 회원 권한 변경 핸들러 (확인창 없이 즉시 변경)
    const handleToggleRole = async (userId: number, currentRole: "USER" | "ADMIN") => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";

        try {
            await adminApi.updateUser(userId, { role: newRole });
            setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
        } catch (e) {
            if (Platform.OS === "web") {
                window.alert("권한 변경에 실패했습니다.");
            } else {
                Alert.alert("오류", "권한 변경에 실패했습니다.");
            }
        }
    };

    // 3. 회원 삭제(소프트 딜리트) 핸들러 (삭제는 위험하므로 확인창 유지)
    const handleDeleteUser = async (userId: number, nickname: string) => {
        const message = `'${nickname}'님을 정말 탈퇴(삭제) 처리하시겠습니까?`;

        if (Platform.OS === "web") {
            const confirmed = window.confirm(message);
            if (confirmed) {
                try {
                    await adminApi.deleteUser(userId);
                    setUsers(prev => prev.filter(u => u.id !== userId));
                    setTotalCount(prev => prev - 1);
                    window.alert("회원이 삭제되었습니다.");
                } catch (e) {
                    window.alert("회원 삭제에 실패했습니다.");
                }
            }
            return;
        }

        Alert.alert("회원 삭제", message, [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    try {
                        await adminApi.deleteUser(userId);
                        setUsers(prev => prev.filter(u => u.id !== userId));
                        setTotalCount(prev => prev - 1);
                        Alert.alert("성공", "회원이 삭제되었습니다.");
                    } catch (e) {
                        Alert.alert("오류", "회원 삭제에 실패했습니다.");
                    }
                },
            },
        ]);
    };

    // ✅ 모달 열기 핸들러 추가
    const handleOpenEdit = (user: AdminUser) => {
        setSelectedUser(user);
        setIsEditModalVisible(true);
    };

    return (
        <View className="flex-1 items-center">
            <View className="w-full flex-1 ">
                {/* 헤더 */}
                <Title
                    title="회원 관리"
                    showBackButton={true}
                    onBackPress={() => router.replace("/admin")}
                    className="py-6 md:hidden"
                />

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* 상단 안내 카드 */}
                    <Card className="p-4 mb-5 bg-bg-paper border border-divider rounded-2xl flex-row items-center justify-between">
                        <View>
                            <TextComponent className="text-sm font-bold text-text-default">
                                전체 회원 목록
                            </TextComponent>
                            <TextComponent className="text-xs text-text-secondary mt-0.5">
                                총 {totalCount}명의 회원이 등록되어 있습니다.
                            </TextComponent>
                        </View>
                        <TouchableOpacity
                            onPress={fetchUsers}
                            className="p-2 bg-bg-subtle rounded-xl border border-divider">
                            <Feather
                                name="refresh-cw"
                                size={16}
                                color={isDark ? "#C9C1BA" : "#777777"}
                            />
                        </TouchableOpacity>
                    </Card>

                    {/* 회원 리스트 카드 */}
                    <Card className="px-0 py-1 rounded-2xl border border-divider overflow-hidden bg-bg-paper mb-8">
                        {isLoading ? (
                            <View className="py-16 items-center justify-center">
                                <LoadingIndicator />
                            </View>
                        ) : users.length === 0 ? (
                            <View className="py-16 items-center justify-center">
                                <TextComponent className="text-text-secondary text-sm">
                                    등록된 회원이 없습니다.
                                </TextComponent>
                            </View>
                        ) : (
                            users.map((user, index) => (
                                <View
                                    key={user.id}
                                    className={`flex-row items-center justify-between px-5 py-4 ${
                                        index !== users.length - 1 ? "border-b border-divider" : ""
                                    }`}>
                                    {/* 유저 정보 클릭 시 상세 조회 */}
                                    <TouchableOpacity
                                        onPress={() => handleViewDetail(user.id)}
                                        className="flex-row items-center gap-3.5 flex-1 pr-2">
                                        <View className="w-10 h-10 rounded-full bg-bg-subtle items-center justify-center border border-divider">
                                            <Feather
                                                name="user"
                                                size={18}
                                                color={isDark ? "#F79C79" : "#EF7D6D"}
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <TextComponent
                                                className="font-bold text-text-default text-[15px]"
                                                numberOfLines={1}>
                                                {user.nickname}
                                            </TextComponent>
                                            <TextComponent
                                                className="text-xs text-text-secondary mt-0.5"
                                                numberOfLines={1}>
                                                {user.email}
                                            </TextComponent>
                                        </View>
                                    </TouchableOpacity>

                                    {/* 우측 액션 버튼들 (권한 토글 + 수정 + 삭제) */}
                                    {/* ✅ 버튼들의 수직 정렬을 맞추기 위해 items-end를 items-center로 변경 */}
                                    <View className="items-center gap-1.5 flex-row">
                                        <TouchableOpacity
                                            onPress={() => handleToggleRole(user.id, user.role)}
                                            className={`px-2.5 py-1 rounded-full ${
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
                                        </TouchableOpacity>

                                        {/* ✅ 수정 버튼 추가 */}
                                        <TouchableOpacity
                                            onPress={() => handleOpenEdit(user)}
                                            className="p-1.5 bg-bg-subtle rounded-lg border border-divider ml-1">
                                            <Feather
                                                name="edit-2"
                                                size={14}
                                                color={isDark ? "#C9C1BA" : "#777777"}
                                            />
                                        </TouchableOpacity>

                                        {/* 삭제 버튼 추가 */}
                                        <TouchableOpacity
                                            onPress={() => handleDeleteUser(user.id, user.nickname)}
                                            className="p-1.5 bg-bg-subtle rounded-lg border border-divider ml-1">
                                            <Feather name="trash-2" size={14} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </Card>
                </ScrollView>
            </View>

            {/* ✅ 회원 수정 모달 추가 */}
            <EditUserModal
                visible={isEditModalVisible}
                user={selectedUser}
                onClose={() => setIsEditModalVisible(false)}
                onSuccess={fetchUsers}
            />
        </View>
    );
}
