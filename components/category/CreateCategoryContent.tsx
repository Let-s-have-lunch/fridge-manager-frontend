import { useState } from "react";
import { View } from "react-native";

import Title from "@/components/common/title/Title";
import InputGroup from "@/components/common/input/InputGroup";
import Input from "@/components/common/input/Input";
import Button from "@/components/common/button/Button";
import TextComponent from "@/components/common/text/TextComponent";
import categoryApi from "@/api/user/categoryApi";

interface Props {
    mode: "create" | "edit";
    category?: Category;

    onClose: () => void;
    onComplete: () => void;
}

export default function CreateCategoryContent({ mode, category, onClose, onComplete }: Props) {
    const [name, setName] = useState(category?.name ?? "");

    const handleCreate = async () => {
        if (!name.trim()) return;

        try {
            if (mode === "create") {
                await categoryApi.createCategory({
                    name,
                });
            } else {
                await categoryApi.updateCategory(category!.id, {
                    name,
                });
            }

            setName("");
            onComplete();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View className="px-6 pt-6 pb-8">
            <Title
                title={mode === "create" ? "카테고리 추가" : "카테고리 수정"}
                forceCenter
                className="mb-6"
                textClassName="text-2xl leading-8 text-text-default"
            />

            <InputGroup label="카테고리 이름" className="mb-2">
                <Input
                    value={name}
                    onChangeText={setName}
                    placeholder="카테고리 이름을 입력해주세요."
                    maxLength={10}
                />
            </InputGroup>

            <View className="mb-5 items-end">
                <TextComponent className="text-sm text-text-subtle">{name.length}/10</TextComponent>
            </View>

            <View className="mt-2 flex-row gap-3">
                <Button
                    wrap
                    variant="outlined"
                    onPress={() => {
                        setName("");
                        onClose();
                    }}>
                    취소
                </Button>

                <Button wrap disabled={!name.trim()} onPress={handleCreate}>
                    저장
                </Button>
            </View>
        </View>
    );
}
