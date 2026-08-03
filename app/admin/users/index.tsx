import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    useColorScheme,
    Platform,
    Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import Pagination from "@/components/common/pagination/Paginnation";
import adminUserApi from "@/api/admin/adminUserApi";
import { AdminUser } from "@/types/admin";
import EditUserModal from "@/components/domain/admin/EditUserModal";

export default function AdminUserManagement() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { page, size } = useLocalSearchParams<{ page: string; size: string }>();
    const currentPage = Number(page) || 1;
    const pageSize = Number(size) || 15;

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

    // 회원 목록 불러오기 (페이지네이션 적용)
    const fetchUsers = useCallback(
        async (targetPage: number, targetSize: number) => {
            try {
                setIsLoading(true);
                const response = await adminUserApi.getUserList(targetPage, targetSize); // ✅ adminUserApi 사용
                setUsers(response.list);
                setTotalCount(response.total);
            } catch (error) {
                console.error("회원 목록 조회 실패:", error);
                if (Platform.OS === "web") {
                    window.alert("회원 목록을 불러오지 못했습니다.");
                } else {
                    Alert.alert("오류", "회원 목록을 불러오지 못했습니다.", [
                        { text: "확인", onPress: () => router.back() },
                    ]);
                }
                setUsers([]);
            } finally {
                setIsLoading(false);
            }
        },
        [router],
    );

    useEffect(() => {
        fetchUsers(currentPage, pageSize);
    }, [currentPage, pageSize, fetchUsers]);

    const totalPage = Math.ceil(totalCount / pageSize) || 1;

    // 1. 회원 상세 정보 확인
    const handleViewDetail = async (userId: number) => {
        try {
            const detail: AdminUser = await adminUserApi.getUserDetail(userId); // ✅ adminUserApi 사용
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

    // 2. 회원 권한 변경 핸들러
    const handleToggleRole = async (userId: number, currentRole: "USER" | "ADMIN") => {
        const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
        try {
            await adminUserApi.updateUser(userId, { role: newRole }); // ✅ adminUserApi 사용
            setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)));
        } catch (e) {
            if (Platform.OS === "web") {
                window.alert("권한 변경에 실패했습니다.");
            } else {
                Alert.alert("오류", "권한 변경에 실패했습니다.");
            }
        }
    };

    // 3. 회원 삭제 핸들러
    const handleDeleteUser = async (userId: number, nickname: string) => {
        const message = `'${nickname}'님을 정말 탈퇴(삭제) 처리하시겠습니까?`;

        if (Platform.OS === "web") {
            const confirmed = window.confirm(message);
            if (confirmed) {
                try {
                    await adminUserApi.deleteUser(userId); // ✅ adminUserApi 사용
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
                        await adminUserApi.deleteUser(userId); // ✅ adminUserApi 사용
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

    // 모달 열기 핸들러
    const handleOpenEdit = (user: AdminUser) => {
        setSelectedUser(user);
        setIsEditModalVisible(true);
    };

    return (
        <View className="flex-1 w-full">
            {/* 상단 타이틀 영역 */}
            <Title
                title="사용자 관리"
                description={`서비스에 가입한 유저 목록을 조회하고 관리합니다. (총 ${totalCount}명)`}
                className="h-auto pb-4 mb-6"
            />

            {/* 테이블 헤더 */}
            <View className="hidden md:flex flex-row items-center px-4 py-3 border border-divider border-b-0 bg-primary-main rounded-t-xl">
                <TextComponent className="w-16 font-bold text-primary-contrast text-center">
                    ID
                </TextComponent>
                <TextComponent className="w-32 font-bold text-primary-contrast px-4">
                    닉네임
                </TextComponent>
                <TextComponent className="flex-1 font-bold text-primary-contrast px-4">
                    이메일
                </TextComponent>
                <TextComponent className="w-28 font-bold text-primary-contrast text-center">
                    가입일
                </TextComponent>
                <TextComponent className="w-24 font-bold text-primary-contrast text-center">
                    권한
                </TextComponent>
                <TextComponent className="w-28 font-bold text-primary-contrast text-center">
                    관리
                </TextComponent>
            </View>

            {/* 본문 리스트 영역 */}
            <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
                {isLoading ? (
                    <View className="py-20 justify-center items-center border border-divider border-t-0 bg-bg-paper rounded-b-xl">
                        <LoadingIndicator />
                    </View>
                ) : users.length === 0 ? (
                    <View className="py-20 justify-center items-center border border-divider border-t-0 bg-bg-paper rounded-b-xl">
                        <TextComponent className="text-text-secondary">
                            등록된 회원이 없습니다.
                        </TextComponent>
                    </View>
                ) : (
                    <View className="w-full pb-4 md:pb-0">
                        {users.map((user, index) => (
                            <View key={user.id} className="w-full">
                                {/* 📱 모바일 전용 카드형 UI */}
                                <View className="md:hidden p-4 bg-bg-paper border border-divider rounded-xl my-1.5 shadow-sm mx-2">
                                    <Pressable onPress={() => handleViewDetail(user.id)}>
                                        <View className="flex-row justify-between items-center mb-2">
                                            <TextComponent className="text-xs text-text-secondary font-medium">
                                                No. {user.id} |{" "}
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TextComponent>
                                            <View
                                                className={twMerge(
                                                    "px-2 py-0.5 rounded-md",
                                                    user.role === "ADMIN"
                                                        ? "bg-primary-main"
                                                        : "bg-bg-subtle",
                                                )}>
                                                <TextComponent
                                                    className={twMerge(
                                                        "text-[10px] font-bold",
                                                        user.role === "ADMIN"
                                                            ? "text-white"
                                                            : "text-text-secondary",
                                                    )}>
                                                    {user.role}
                                                </TextComponent>
                                            </View>
                                        </View>
                                        <TextComponent
                                            className="font-bold text-text-default text-base mb-1"
                                            numberOfLines={1}>
                                            {user.nickname}
                                        </TextComponent>
                                        <TextComponent className="text-xs text-text-secondary mb-3">
                                            {user.email}
                                        </TextComponent>
                                    </Pressable>

                                    {/* 모바일 액션 버튼 그룹 */}
                                    <View className="flex-row justify-end items-center gap-2 pt-3 border-t border-divider">
                                        <TouchableOpacity
                                            onPress={() => handleToggleRole(user.id, user.role)}
                                            className="px-3 py-1.5 bg-bg-subtle rounded-lg border border-divider hover:bg-secondary-contrast active:opacity-85 transition-colors">
                                            <TextComponent className="text-xs text-text-secondary font-medium">
                                                권한변경
                                            </TextComponent>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleOpenEdit(user)}
                                            className="p-1.5 bg-bg-subtle rounded-lg border border-divider hover:bg-secondary-contrast active:opacity-85 transition-colors">
                                            <Feather
                                                name="edit-2"
                                                size={16}
                                                color={isDark ? "#C9C1BA" : "#777777"}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteUser(user.id, user.nickname)}
                                            className="p-1.5 bg-bg-subtle rounded-lg border border-divider hover:bg-error-bg active:opacity-85 transition-colors">
                                            <Feather name="trash-2" size={16} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* 💻 웹/태블릿 전용 테이블 Row UI */}
                                <Pressable
                                    onPress={() => handleViewDetail(user.id)}
                                    className={twMerge(
                                        "hidden md:flex flex-row items-center px-4 py-3.5 bg-bg-paper border-x border-b border-divider",
                                        index === users.length - 1 && "rounded-b-xl",
                                    )}>
                                    <TextComponent className="w-16 text-center text-text-secondary">
                                        {user.id}
                                    </TextComponent>
                                    <TextComponent
                                        className="w-32 font-bold text-text-default px-4"
                                        numberOfLines={1}>
                                        {user.nickname}
                                    </TextComponent>
                                    <TextComponent
                                        className="flex-1 text-sm text-text-secondary px-4"
                                        numberOfLines={1}>
                                        {user.email}
                                    </TextComponent>
                                    <TextComponent className="w-28 text-sm text-text-secondary text-center">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </TextComponent>

                                    {/* 권한 뱃지 버튼 */}
                                    <View className="w-24 items-center">
                                        <TouchableOpacity
                                            onPress={() => handleToggleRole(user.id, user.role)}
                                            className={twMerge(
                                                "px-2.5 py-1 rounded-full transition-colors active:opacity-85",
                                                user.role === "ADMIN"
                                                    ? "bg-primary-main hover:bg-primary-point"
                                                    : "bg-bg-subtle border border-divider hover:bg-secondary-contrast",
                                            )}>
                                            <TextComponent
                                                className={twMerge(
                                                    "text-[10px] font-bold",
                                                    user.role === "ADMIN"
                                                        ? "text-white"
                                                        : "text-text-secondary",
                                                )}>
                                                {user.role}
                                            </TextComponent>
                                        </TouchableOpacity>
                                    </View>

                                    {/* 액션 버튼 그룹 */}
                                    <View className="w-28 flex-row justify-center gap-1.5">
                                        <TouchableOpacity
                                            onPress={() => handleOpenEdit(user)}
                                            className="p-1.5 bg-bg-subtle rounded-lg border border-divider hover:bg-secondary-contrast active:opacity-85 transition-colors">
                                            <Feather
                                                name="edit-2"
                                                size={14}
                                                color={isDark ? "#C9C1BA" : "#777777"}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => handleDeleteUser(user.id, user.nickname)}
                                            className="p-1.5 bg-bg-subtle rounded-lg border border-divider hover:bg-error-bg active:opacity-85 transition-colors">
                                            <Feather name="trash-2" size={14} color="#EF4444" />
                                        </TouchableOpacity>
                                    </View>
                                </Pressable>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* 페이지네이션 컴포넌트 */}
            <View className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPage}
                    onPageChange={(newPage: number) =>
                        router.setParams({ page: String(newPage), size: String(pageSize) })
                    }
                />
            </View>

            {/* 회원 수정 모달 */}
            <EditUserModal
                visible={isEditModalVisible}
                user={selectedUser}
                onClose={() => setIsEditModalVisible(false)}
                onSuccess={() => fetchUsers(currentPage, pageSize)}
            />
        </View>
    );
}
