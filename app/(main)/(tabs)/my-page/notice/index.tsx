import React, { useCallback, useEffect, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Title from "@/components/common/title/Title";
import TextComponent from "@/components/common/text/TextComponent";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import noticeApi, { NoticeItem } from "@/api/user/noticeApi";

function UserNoticePage() {
    const router = useRouter();
    const [notices, setNotices] = useState<NoticeItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadNotices = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await noticeApi.fetchNotices();
            setNotices(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotices().then(() => {})
    }, [loadNotices]);

    if (isLoading) {
        return (
            <View className="flex-1 bg-bg-paper p-6 justify-center items-center">
                <LoadingIndicator />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-bg-paper p-4 md:p-6">
            <View className="mb-6">
                <Title
                    title="공지사항"
                    description="새로운 소식과 안내 사항을 확인하세요."
                    showBackButton={true}
                    onBackPress={() => router.back()}
                    className="h-auto py-1"
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {!Array.isArray(notices) || notices.length === 0 ? (
                    <View className="py-20 items-center justify-center">
                        <TextComponent className="text-text-secondary text-base">
                            등록된 공지사항이 없습니다.
                        </TextComponent>
                    </View>
                ) : (
                    notices.map(item => (
                        <Pressable
                            key={item.id}
                            onPress={() => router.push(`/my-page/notice/${item.id}`)}
                            className="bg-bg-subtle/30 border border-divider rounded-2xl p-4 mb-3 active:opacity-70">
                            <TextComponent className="text-xs text-text-secondary mb-1">
                                {item.createdAt}
                            </TextComponent>
                            <TextComponent className="font-bold text-text-default text-base">
                                {item.title}
                            </TextComponent>
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

export default UserNoticePage;
