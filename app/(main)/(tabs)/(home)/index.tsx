import { useSetupLayout } from "@/hooks/useSetupLayout";
import { useCallback, useEffect, useState } from "react";
import { Fridge } from "@/types/fridge";
import { Product } from "@/types/product";
import fridgeApi from "@/api/user/fridgeApi";
import productApi from "@/api/user/productApi";
import { Text } from "react-native";
import { useHomeStore } from "@/stores/home/productStore";
import CategoryTabs, { Category } from "@/components/home/CategoryTabs";
import { useAuthStore } from "@/stores/auth/useAuthStore";

export default function HomeScreen() {
    useSetupLayout({ showMainHeader: true });
    // const [category, setCategory] = useState<Category>("전체");
    // const [keyword, setKeyword] = useState("");

    const fridges = useHomeStore(state => state.fridges);
    const setFridges = useHomeStore(state => state.setFridges);

    const selectedFridgeId = useHomeStore(state => state.selectedFridgeId);
    const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);

    const [products, setProducts] = useState<Product[]>([]);

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
    },[setFridges, setSelectedFridgeId]);

    useEffect(() => {
        if (!isLoggedIn) return;
        loadFridges().then(() => {});
    }, [isLoggedIn, loadFridges]);

    const loadProducts = async (fridgeId: number) => {
        try {
            const list = await productApi.getProductList(fridgeId);
            setProducts(list);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!isLoggedIn || selectedFridgeId === null) return;

        loadProducts(selectedFridgeId).then(() => {});
    }, [isLoggedIn, selectedFridgeId]);

    useSetupLayout({ showMainHeader: true, showDesktopHeader: true });
    const [category, setCategory] = useState<Category>("전체");
    const [keyword, setKeyword] = useState("");

    return (
        <>

            {/*<CategoryTabs value={category} onChange={setCategory} />*/}
            {products.map(product => (
                <Text key={product.id}>{product.name}</Text>
            ))}
        </>

        // <MainHeader />
        // <CategoryTab />
        // <View className={"flex-1"}>
        //     {/*<FoodList/>*/}
        // </View>
    );
}
