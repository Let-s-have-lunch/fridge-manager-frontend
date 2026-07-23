import { View, ScrollView } from "react-native";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainHeader from "@/components/layout/main/MainHeader";
import ContentContainer from "@/components/layout/common/ContentContainer";
import MainFooter from "@/components/layout/main/MainFooter"; // 푸터 만들면 주석 해제!

export default function MainLayout() {
    const { showMainHeader, showMainFooter } = useLayoutStore();

    return (
        <View className="flex-1 bg-bg-light">
            {showMainHeader && <MainHeader />}

            <ScrollView showsVerticalScrollIndicator={false}>
                <ContentContainer>
                    <Slot />
                </ContentContainer>
            </ScrollView>

            {showMainFooter &&
                <MainFooter />
                }
        </View>
    );
}
