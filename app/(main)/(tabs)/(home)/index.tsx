import { useSetupLayout } from "@/hooks/useSetupLayout";
import { useCallback, useEffect, useState } from "react";
import fridgeApi from "@/api/user/fridgeApi";
import productApi from "@/api/user/productApi";
import { FlatList, View } from "react-native";
import { useHomeStore } from "@/stores/home/productStore";
import CategoryTabs, { Category } from "@/components/home/CategoryTabs";
import ProductCard from "@/components/home/ProductCard";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function HomeScreen() {
    useSetupLayout({ showMainHeader: true, showDesktopHeader: true });

    const setFridges = useHomeStore(state => state.setFridges);
    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);
    const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);

    const { products, setProducts } = useHomeStore();

    const { isLoggedIn } = useAuthStore();

    const loadFridges = useCallback(async () => {
        try {
            const fridgeList = await fridgeApi.getFridgeList();
            setFridges(fridgeList);

            if (fridgeList.length > 0) {
                setSelectedFridgeId(fridgeList[0].id);
            }
        } catch (error) {
            console.log(error);
        }
    }, [setFridges, setSelectedFridgeId]);

    useEffect(() => {
        if (!isLoggedIn) return;
        loadFridges().then(() => {});
    }, [isLoggedIn, loadFridges]);
    
    
    useEffect(() => {
        if (!isLoggedIn || selectedFridgeId === null) return;

        const loadProducts = async () => {
            try {
                const list = await productApi.getProductList(selectedFridgeId);
                console.log("API 결과", list);
                setProducts(list);
            } catch (error) {
                console.error(error);
            }
        };
        loadProducts().then(() => {});
    },[isLoggedIn, selectedFridgeId, setProducts])

    const [category, setCategory] = useState<Category>("전체");
    const [keyword, setKeyword] = useState("");

    return (
        <>
            <View className={"gap-5"}>
            <CategoryTabs value={category} onChange={setCategory} />
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProductCard product={item} />
                )}
            />
            </View>
        </>

        // <MainHeader />
        // <CategoryTab />
        // <View className={"flex-1"}>
        //     {/*<FoodList/>*/}
        // </View>
    );
}