import { useSetupLayout } from "@/hooks/useSetupLayout";
import { useCallback, useEffect, useState } from "react";
import fridgeApi from "@/api/user/fridgeApi";
import productApi from "@/api/user/productApi";
import { FlatList, View, Platform, Alert } from "react-native";
import { useHomeStore } from "@/stores/home/productStore";
import CategoryTabs from "@/components/domain/home/CategoryTabs";
import ProductCard from "@/components/domain/home/ProductCard";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { ProductDetailItemType, ProductListItemType } from "@/types/product";
import ProductFormModal from "@/components/domain/product/ProductFormModal";
import GuestView from "@/components/domain/home/GuestView";
import Button from "@/components/common/button/Button";

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

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductDetailItemType | null>(null);

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

    const loadProducts = useCallback(async () => {
        if (!selectedFridgeId) return;
        try {
            const list = await productApi.getProductList(selectedFridgeId);
            setProducts(list);
        } catch (error) {
            console.error(error);
        }
    }, [selectedFridgeId, setProducts]);

    useEffect(() => {
        if (!isLoggedIn || selectedFridgeId === null) return;
        loadProducts().then(() => {});
    }, [isLoggedIn, selectedFridgeId, loadProducts]);

    const handleOpenAddModal = () => {
        setSelectedProduct(null);
        setIsModalVisible(true);
    };

    const handleOpenEditModal = async (product: ProductListItemType) => {
        try {

            const detailData = await productApi.getProductById(product.id);
            setSelectedProduct(detailData);
            setIsModalVisible(true);

        } catch (error) {
            console.error("상세 정보 로드 실패:", error);
            if (Platform.OS === "web") {
                alert("상세 정보를 불러오는데 실패했습니다.");
            } else {
                Alert.alert("오류", "상세 정보를 불러오는데 실패했습니다.");
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedProduct(null);
    };


    const filteredProducts = products.filter(product => {
        const storageMatch =
            category === "전체"
                ? true
                : category === "냉장"
                  ? product.storageType === "REFRIGERATED"
                  : category === "냉동"
                    ? product.storageType === "FROZEN"
                    : product.storageType === "ROOM_TEMP";

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
            <View className="flex-1">
                <CategoryTabs value={category} onChange={setCategory} />

                {!isLoggedIn ? (
                    <GuestView />
                ) : (
                    <FlatList
                        data={sortedProducts}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <ProductCard product={item} onEdit={() => handleOpenEditModal(item)} />
                        )}
                        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {isLoggedIn && (
                <>
                    <Button
                        variant="contained-circle"
                        size="fab"
                        className="absolute bottom-7 right-7"
                        onPress={handleOpenAddModal}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.18,
                            shadowRadius: 8,
                            elevation: 8,
                        }}>
                        <Ionicons name="add" size={43} />
                    </Button>

                    <ProductFormModal
                        visible={isModalVisible}
                        onClose={handleCloseModal}
                        initialData={selectedProduct}
                        onRefresh={loadProducts}
                    />
                </>
            )}
        </>
    );
}
