import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View, Image } from "react-native";

import { categoryIcons } from "@/constants/categoryIcons";
import TextComponent from "@/components/common/text/TextComponent";
import { Category } from "@/types/category";

interface SelectCategoryModalProps {
    categories: Category[];
    onClose: () => void;
    onSelect: (category: Category) => void;
    onAddCategory: () => void;

    onEditCategory: (category: Category) => void;
}

export default function SelectCategoryContent({
    categories,
    onClose,
    onSelect,
    onAddCategory,
    onEditCategory,
}: SelectCategoryModalProps) {
    const [showCustomCategory, setShowCustomCategory] = useState(false);


    const defaultCategories = useMemo(
        () => categories.filter(item => item.isDefault),
        [categories],
    );

    const customCategories = useMemo(
        () => categories.filter(item => !item.isDefault),
        [categories],
    );

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <Pressable style={styles.categoryItem} onPress={() => onSelect(item)}>
            <View style={styles.iconWrapper} className="bg-bg-subtle">
                <Image source={categoryIcons[item.icon]} style={styles.icon} />
            </View>

            <TextComponent numberOfLines={2} className="mt-2 text-center text-text-default">
                {item.name}
            </TextComponent>
        </Pressable>
    );

    return (
        <Pressable style={{ flex: 1 }} onPress={onClose}>
            <Pressable style={styles.container} className="bg-bg-paper" onPress={() => {}}>
                <TextComponent className="mb-6 text-text-default text-center text-[18px] font-bold">
                    카테고리 선택
                </TextComponent>

                <FlatList
                    data={defaultCategories}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderCategoryItem}
                    numColumns={3}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={styles.listContent}
                    ListFooterComponent={
                        <>
                            <Pressable
                                style={styles.addButton}
                                className="border-divider"
                                onPress={onAddCategory}>
                                <TextComponent className="font-semibold text-primary-main">
                                    ＋ 카테고리 추가
                                </TextComponent>
                            </Pressable>

                            {customCategories.length > 0 && (
                                <>
                                    <Pressable
                                        style={styles.accordion}
                                        onPress={() => setShowCustomCategory(!showCustomCategory)}>
                                        <TextComponent className="font-semibold">
                                            내가 만든 카테고리 {showCustomCategory ? "▲" : "▼"}
                                        </TextComponent>
                                    </Pressable>

                                    {showCustomCategory && (
                                        <View style={styles.customWrapper}>
                                            <View style={styles.rowWrap}>
                                                {customCategories.map(item => (
                                                    <View key={item.id} style={styles.categoryItem}>
                                                        {/* 카테고리 선택 */}
                                                        <Pressable onPress={() => onSelect(item)}>
                                                            <View
                                                                style={styles.iconWrapper}
                                                                className="bg-bg-subtle">
                                                                <Image
                                                                    source={
                                                                        categoryIcons[item.icon]
                                                                    }
                                                                    style={styles.icon}
                                                                />
                                                            </View>
                                                        </Pressable>

                                                        {/* 카테고리 이름 + ⋮ */}
                                                        <View className="mt-2 flex-row items-center justify-center">
                                                            <TextComponent
                                                                numberOfLines={1}
                                                                className="max-w-[65px] text-center text-text-default">
                                                                {item.name}
                                                            </TextComponent>

                                                            <Pressable
                                                                hitSlop={8}
                                                                className="ml-1"
                                                                onPress={() =>
                                                                    onEditCategory(item)
                                                                }>
                                                                <TextComponent className="text-lg font-bold text-text-subtle">
                                                                    ⋮
                                                                </TextComponent>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                        </>
                    }
                />
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },

    listContent: {
        paddingBottom: 40,
    },

    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },

    icon: {
        width: 65,
        height: 65,
        resizeMode: "contain",
    },

    row: {
        justifyContent: "space-between",
        marginBottom: 8,
    },

    rowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    customWrapper: {
        marginTop: 8,
    },

    categoryItem: {
        width: "31%",
        alignItems: "center",
        marginBottom: 24,
    },

    addButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 8,
    },

    accordion: {
        paddingVertical: 18,
        alignItems: "center",
    },
});
