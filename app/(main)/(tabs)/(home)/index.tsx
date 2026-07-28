import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import MainHeader from "@/components/layout/main/MainHeader";
import CategoryTab from "@/components/home/CategoryTab";
import { useSetupLayout } from "@/hooks/useSetupLayout";

export default function HomeScreen() {
    useSetupLayout({ showMainHeader: true });
    return (
        <></>
        // <MainHeader />
        // <CategoryTab />
        // <View className={"flex-1"}>
        //     {/*<FoodList/>*/}
        // </View>
    );
}