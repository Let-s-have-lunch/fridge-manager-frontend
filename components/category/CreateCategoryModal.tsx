import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";

import TextComponent from "@/components/common/text/TextComponent";
import categoryApi from "@/api/user/categoryApi";

const ICONS = ["🥕", "🍎", "🥩", "🥛", "🍞", "🍪", "🍚", "🍜", "🥫", "🍺", "🧴", "📦"];

interface Props {
    visible: boolean;
    onClose: () => void;
    onComplete: () => void;
}

export default function CreateCategoryModal({ visible, onClose, onComplete }: Props) {
    const [name, setName] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("");

    const handleCreate = async () => {
        if (!name.trim()) return;

        try {
            await categoryApi.createCategory({
                name,
            });

            setName("");
            setSelectedIcon("");

            onComplete();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <TextComponent className="mb-6 text-center">
                        카테고리 추가
                    </TextComponent>

                    <TextComponent className="mb-2">카테고리 이름</TextComponent>

                    <TextInput
                        style={styles.input}
                        placeholder="예) 라면"
                        value={name}
                        onChangeText={setName}
                    />

                    <TextComponent className="mb-3 mt-6">아이콘 선택</TextComponent>

                    <ScrollView contentContainerStyle={styles.iconContainer}>
                        {ICONS.map(icon => (
                            <Pressable
                                key={icon}
                                style={[
                                    styles.iconButton,
                                    selectedIcon === icon && styles.selected,
                                ]}
                                onPress={() => setSelectedIcon(icon)}>
                                <TextComponent style={{ fontSize: 28 }}>{icon}</TextComponent>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <View style={styles.buttonRow}>
                        <Pressable style={styles.cancelButton} onPress={onClose}>
                            <TextComponent>취소</TextComponent>
                        </Pressable>

                        <Pressable style={styles.submitButton} onPress={handleCreate}>
                            <TextComponent className="text-white">등록</TextComponent>
                        </Pressable>
                    </View>
                </View>
            </View>
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
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 14,
        paddingHorizontal: 16,
    },

    iconContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    iconButton: {
        width: "22%",
        aspectRatio: 1,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 12,
    },

    selected: {
        borderColor: "#BACFCD",
        backgroundColor: "#F3F9F8",
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },

    cancelButton: {
        flex: 1,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
        borderRadius: 12,
        backgroundColor: "#F3F4F6",
    },

    submitButton: {
        flex: 1,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 8,
        borderRadius: 12,
        backgroundColor: "#BACFCD",
    },
});
