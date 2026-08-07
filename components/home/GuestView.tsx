import React from "react";
import { View, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import Button from "@/components/common/button/Button";
import Card from "@/components/common/card/Card";

export default function GuestView() {
    const router = useRouter();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, alignItems: "center" }}
            className="flex-1 px-1">
            {/* 1. 메인 일러스트 */}
            <Image
                source={require("@/assets/images/guest-fridge.png")}
                // 💡 이미지 영역을 기존 220 -> 260으로 조금 더 키워두었습니다! (여백 자른 사진 넣으시면 딱 예쁠 거예요)
                style={{ width: 260, height: 260, marginTop: 10 }}
                resizeMode="contain"
            />

            {/* 2. 메인 카피 */}
            <TextComponent className="text-[18px] font-bold mt-2 text-text-default">
                스마트한{" "}
                <TextComponent className="text-primary-main font-bold">냉장고 관리</TextComponent>의
                시작
            </TextComponent>
            <TextComponent className="text-text-secondary text-center text-[14px] mt-2 leading-5">
                {/* 💡 중괄호로 감싸서 \n이 진짜 줄바꿈으로 작동하도록 수정! */}
                {"식재료를 등록하고 유통기한을 관리해\n음식 낭비를 줄여보세요."}
            </TextComponent>

            {/* 3. 기능 안내 카드 (3열 배치) */}
            <View className="flex-row justify-between w-full mt-8 gap-2 md:gap-4">
                <FeatureCard
                    icon="notifications"
                    iconBg="#FCE1DE"
                    iconColor="#E98D82"
                    title="유통기한 알림"
                    desc={"다가오는 유통기한을\n미리 알려드려요."} // 💡 수정됨
                />
                <FeatureCard
                    icon="basket"
                    iconBg="#DCEAF6"
                    iconColor="#7EAED2"
                    title="식재료 관리"
                    desc={"식재료를 등록하고\n보관 상태를 관리해요."} // 💡 수정됨
                />
                <FeatureCard
                    icon="pie-chart"
                    iconBg="#E8F3E4"
                    iconColor="#6FAF70"
                    title="소비/폐기 통계"
                    desc={"소비와 폐기 현황을\n한눈에 확인해요."} // 💡 수정됨
                />
            </View>

            {/* 4. 로그인 / 회원가입 유도 박스 */}
            <Card className="w-full mt-8 items-center py-7 px-6">
                <TextComponent className="font-bold text-[15px] text-text-default">
                    로그인하고 더 많은 기능을 이용해보세요!
                </TextComponent>
                <TextComponent className="text-[12px] text-text-secondary mt-1.5 mb-6 text-center">
                    데이터는 안전하게 저장되며, 언제 어디서나 확인할 수 있어요.
                </TextComponent>

                {/* 🚨 핵심 수정: 모바일에서는 세로(flex-col), 웹(md 이상)에서는 가로(flex-row) 배치! */}
                <View className="w-full flex-col md:flex-row gap-3">
                    <Button wrap={true} onPress={() => router.push("/auth/login")}>
                        로그인
                    </Button>
                    <Button
                        className={"border-primary-main"}
                        textClassName={"text-primary-main"}
                        wrap={true}
                        variant="outlined"
                        onPress={() => router.push("/auth/register")}>
                        회원가입
                    </Button>
                </View>
            </Card>
        </ScrollView>
    );
}

// 💡 기능 카드 컴포넌트
function FeatureCard({ icon, iconBg, iconColor, title, desc }: any) {
    return (
        <View
            className="flex-1 bg-bg-paper rounded-[20px] p-3 md:py-5 items-center"
            style={{ elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8 }}>
            <View
                className="w-12 h-12 md:w-14 md:h-14 rounded-full items-center justify-center mb-3 md:mb-4"
                style={{ backgroundColor: iconBg }}>
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>

            <TextComponent className="font-bold text-[12px] md:text-[14px] text-text-default mb-1.5 text-center leading-4 md:leading-5">
                {title}
            </TextComponent>
            <TextComponent className="text-[10px] md:text-[12px] text-text-secondary text-center leading-3 md:leading-4">
                {desc}
            </TextComponent>
        </View>
    );
}
