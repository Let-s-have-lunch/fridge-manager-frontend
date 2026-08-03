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
    const keyword = useHomeStore(state => state.keyword);
    const category = useHomeStore(state => state.category);
    const setCategory = useHomeStore(state => state.setCategory);
    const sortType = useHomeStore(state => state.sortType);

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
                setProducts(list);
            } catch (error) {
                console.error(error);
            }
        };
        loadProducts().then(() => {});
    },[isLoggedIn, selectedFridgeId, setProducts])



    const filteredProducts = products.filter(product => {
        // 보관방식 필터
        const storageMatch =
            category === "전체"
                ? true
                : category === "냉장"
                  ? product.storageType === "REFRIGERATED"
                  : category === "냉동"
                    ? product.storageType === "FROZEN"
                    : product.storageType === "ROOM_TEMP";

        // 검색 필터
        const keywordMatch = product.name.toLowerCase().includes(keyword.toLowerCase());

        return storageMatch && keywordMatch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortType === "EXPIRE") {
            return a.dDay - b.dDay;
        }

        return a.category.name.localeCompare(b.category.name, "ko");
    });


    return (
        <>
            <View className={"flex-1 gap-5"}>
                <CategoryTabs value={category} onChange={setCategory} />
                <FlatList
                    data={sortedProducts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <ProductCard product={item} />}
                    contentContainerStyle={{
                        paddingBottom: 32,
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </>
    );
}