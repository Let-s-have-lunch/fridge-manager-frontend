import { useSetupLayout } from "@/hooks/useSetupLayout";
import { View } from "react-native";

function StatsPage() {
    useSetupLayout({ showMainFooter: false });

    return <View className={"flex-1"}></View>;
}

export default StatsPage;
