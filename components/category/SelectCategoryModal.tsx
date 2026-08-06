import { useMemo, useState } from "react";
import { FlatList, Modal, Pressable, StyleSheet, View, Image } from "react-native";

import { categoryIcons } from "@/constants/categoryIcons";
import TextComponent from "@/components/common/text/TextComponent";
import { Category } from "@/types/category";

interface SelectCategoryModalProps {
    visible: boolean;
    categories: Category[];

    onClose: () => void;
    onSelect: (category: Category) => void;
    onAddCategory: () => void;
}

export default function SelectCategoryModal({
    visible,
    categories,
    onClose,
    onSelect,
    onAddCategory,
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

    const renderCategoryItem = ({ item }: { item: Category }) => {
        return (
            <Pressable style={styles.categoryItem} onPress={() => onSelect(item)}>
                <View style={styles.iconWrapper} className="bg-bg-subtle">
                    <Image source={categoryIcons[item.icon]} style={styles.icon} />
                </View>
                <TextComponent numberOfLines={2} className="mt-2 text-center">
                    {item.name}
                </TextComponent>
            </Pressable>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.container} className="bg-bg-paper" onPress={() => {}}>
                    <TextComponent className="mb-6 text-center text-[15px] font-bold">
                        카테고리 선택
                    </TextComponent>

                    <FlatList
                        data={defaultCategories}
                        keyExtractor={item => item.id.toString()}
                        renderItem={renderCategoryItem}
                        numColumns={3}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.row}
                    />

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
                                <FlatList
                                    data={customCategories}
                                    keyExtractor={item => item.id.toString()}
                                    renderItem={renderCategoryItem}
                                    numColumns={3}
                                    scrollEnabled={false}
                                    columnWrapperStyle={styles.row}
                                />
                            )}
                        </>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
    },

    container: {
        width: "90%",
        maxHeight: "70%",
        borderRadius: 24,
        padding: 24,
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
    },

    categoryItem: {
        width: "31%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },

    addButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 18,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 6,
    },

    accordion: {
        paddingVertical: 18,
        alignItems: "center",
    },
});
