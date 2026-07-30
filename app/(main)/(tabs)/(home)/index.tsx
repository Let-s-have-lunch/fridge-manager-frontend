import { useSetupLayout } from "@/hooks/useSetupLayout";
import CategoryTabs, { Category } from "@/components/home/CategoryTabs";
import { useState } from "react";
import MainHeader from "@/components/layout/main/MainHeader";

export default function HomeScreen() {
    useSetupLayout({ showMainHeader: true });
    const [category, setCategory] = useState<Category>("전체");
    const [keyword, setKeyword] = useState("");

    return (
        <>
            <CategoryTabs value={category} onChange={setCategory} />
        </>

        // <MainHeader />
        // <CategoryTab />
        // <View className={"flex-1"}>
        //     {/*<FoodList/>*/}
        // </View>
    );
}
