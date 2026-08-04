import { Pressable, ScrollView, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import Input from "@/components/common/input/Input";
import InputGroup from "@/components/common/input/InputGroup";
import TextComponent from "@/components/common/text/TextComponent";

export default function RegisterScreen() {
    const router = useRouter();

    return (
        <ScrollView
            className="flex-1 bg-bg-default"
            contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 16,
                paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled">
            {/* Header */}
            <View className="mb-8 flex-row items-center">
                <Pressable
                    onPress={() => router.back()}
                    className="h-10 w-10 items-center justify-center">
                    <Ionicons name="chevron-back" size={24} color="#2C2C2C" />
                </Pressable>

                <View className="mr-10 flex-1 items-center">
                    <TextComponent className="text-lg font-bold text-text-default">
                        제품 등록
                    </TextComponent>
                </View>
            </View>

            {/* 카테고리 */}
            <InputGroup label="카테고리">
                <Pressable onPress={() => {}}>
                    <View className="relative">
                        <Input editable={false} value="채소" className="pr-10" />
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#9CA3AF"
                            style={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                marginTop: -9,
                            }}
                        />
                    </View>
                </Pressable>
            </InputGroup>

            {/* 제품명 */}
            <InputGroup label="제품명" placeholder="제품명을 입력해주세요." />

            {/* 등록수량 + 단위 */}
            <View className="flex-row gap-3">
                <InputGroup wrap label="등록수량">
                    <Input keyboardType="numeric" placeholder="0" />
                </InputGroup>

                <InputGroup wrap label="단위">
                    <Pressable onPress={() => {}}>
                        <View className="relative">
                            <Input editable={false} value="개" className="pr-10" />
                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color="#9CA3AF"
                                style={{
                                    position: "absolute",
                                    right: 16,
                                    top: "50%",
                                    marginTop: -9,
                                }}
                            />
                        </View>
                    </Pressable>
                </InputGroup>
            </View>

            {/* 저장방식 */}
            <InputGroup label="저장방식">
                <Pressable onPress={() => {}}>
                    <View className="relative">
                        <Input editable={false} value="냉장" className="pr-10" />
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#9CA3AF"
                            style={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                marginTop: -9,
                            }}
                        />
                    </View>
                </Pressable>
            </InputGroup>

            {/* 등록일 */}
            <InputGroup label="등록일">
                <Input editable={false} value="2026.08.04" />
            </InputGroup>

            {/* 소비기한 */}
            <InputGroup label="소비기한">
                <Pressable onPress={() => {}}>
                    <Input editable={false} placeholder="날짜를 선택해주세요." />
                </Pressable>
            </InputGroup>

            {/* 보관상태 */}
            <InputGroup label="보관상태">
                <Pressable onPress={() => {}}>
                    <View className="relative">
                        <Input editable={false} value="보관" className="pr-10" />
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#9CA3AF"
                            style={{
                                position: "absolute",
                                right: 16,
                                top: "50%",
                                marginTop: -9,
                            }}
                        />
                    </View>
                </Pressable>
            </InputGroup>

            {/* 가격 */}
            <InputGroup label="가격">
                <Input keyboardType="numeric" placeholder="0" />
            </InputGroup>

            {/* 메모 */}
            <InputGroup label="메모">
                <Input
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="h-32"
                    placeholder="메모를 입력해주세요."
                />
            </InputGroup>

            {/* 등록 버튼 */}
            <Pressable
                className="mt-6 h-14 items-center justify-center rounded-[15px] bg-primary-main"
                onPress={() => {}}>
                <TextComponent className="font-bold text-[18px] text-white">등록하기</TextComponent>
            </Pressable>
        </ScrollView>
    );
}
