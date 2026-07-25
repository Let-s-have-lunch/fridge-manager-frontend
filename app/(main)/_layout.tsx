import { View, ScrollView } from "react-native";
import { Slot } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";
import MainHeader from "@/components/layout/main/MainHeader";
import ContentContainer from "@/components/layout/common/ContentContainer";
import MainFooter from "@/components/layout/main/MainFooter";

export default function MainLayout() {
    const { showMainHeader, showMainFooter } = useLayoutStore();

    return (
        <View className="flex-1 bg-bg-default">
            {showMainHeader && <MainHeader />}

            <ScrollView showsVerticalScrollIndicator={false}>
                <ContentContainer>
                    <Slot />
                </ContentContainer>
            </ScrollView>

            {showMainFooter && <MainFooter />}
        </View>
    );
}
