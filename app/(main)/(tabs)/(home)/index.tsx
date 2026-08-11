import { useSetupLayout } from "@/hooks/useSetupLayout";
import { useCallback, useEffect, useState } from "react"; // 👈 useState 추가
import fridgeApi from "@/api/user/fridgeApi";
import productApi from "@/api/user/productApi";
import { FlatList, View, Pressable, Platform, Alert } from "react-native";
import { useHomeStore } from "@/stores/home/productStore";
import CategoryTabs from "@/components/domain/home/CategoryTabs";
import ProductCard from "@/components/domain/home/ProductCard";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { ProductDetailItemType, ProductListItemType } from "@/types/product";
import ProductFormModal from "@/components/domain/product/ProductFormModal";
import GuestView from "@/components/domain/home/GuestView"; // 👈 타입 추가

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

    // 💡 모달 상태 관리를 위한 State 추가
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

    // 💡 useEffect 안에 있던 함수를 모달 onRefresh로 넘기기 위해 useCallback으로 분리
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

    // 💡 모달 핸들러 함수들 추가
    const handleOpenAddModal = () => {
        setSelectedProduct(null);
        setIsModalVisible(true);
    };

    // 💡 3. 리스트에서 수정 버튼을 누르면 API를 쏴서 상세 정보를 받아오도록 수정!
    const handleOpenEditModal = async (product: ProductListItemType) => {
        try {
            // 상세 API 호출
            const detailData = await productApi.getProductById(product.id);

            // 완벽한 데이터를 상태에 담고 모달 띄우기
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
                        // 💡 gap 대신 contentContainerStyle에 paddingTop: 16 (또는 20) 추가!
                        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>

            {/* 💡 플러스 버튼과 모달은 로그인 상태일 때만 렌더링! */}
            {isLoggedIn && (
                <>
                    <Pressable
                        onPress={handleOpenAddModal}
                        className={twMerge(
                            "absolute bottom-6 right-5 h-16 w-16 items-center justify-center rounded-full bg-primary-main",
                        )}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.18,
                            shadowRadius: 8,
                            elevation: 8,
                        }}>
                        <Ionicons name={"add"} size={43} color={"white"} />
                    </Pressable>

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
