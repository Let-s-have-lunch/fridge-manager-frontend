import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import MainHeader from "@/components/layout/main/MainHeader";
import CategoryTab from "@/components/home/CategoryTab";

export default function HomeScreen(){
    return (
        <SafeAreaView className={"flex-1 bg-bg-subtle"}>
            <MainHeader />
            <CategoryTab />
            <View className={"flex-1"}>
                {/*<FoodList/>*/}
            </View>

        </SafeAreaView>
    );
}