import { forwardRef, useMemo, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import fridgeApi from "@/api/user/fridgeApi";
import { useHomeStore } from "@/stores/home/productStore";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFridgeSchema, FridgeInputType } from "@/schemas/user/createFridgeSchema";
import axios, { isAxiosError } from "axios";

interface AddFridgeSheetProps {
    onClose: () => void;
}

const AddFridgeSheet = forwardRef<BottomSheetModal, AddFridgeSheetProps>(({ onClose }, ref) => {
    const snapPoints = useMemo(() => ["55%"], []);
    // const [name, setName] = useState("");

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm<FridgeInputType>({
        resolver: zodResolver(createFridgeSchema),
        defaultValues: {
            name: "",
        },
    });
    const name = watch("name");

    const setFridges = useHomeStore(state => state.setFridges);
    const setSelectedFridgeId = useHomeStore(state => state.setSelectedFridgeId);
    const onSubmit = async (data: FridgeInputType) => {
        try {
            const newFridge = await fridgeApi.createFridge(data);

            const fridgeList = await fridgeApi.getFridgeList();

            setFridges(fridgeList);
            setSelectedFridgeId(newFridge.id);

            reset(); // 입력창 초기화
            onClose(); // 바텀시트 닫기
        } catch (error) {
            if (isAxiosError(error)) {
                Alert.alert(
                    "알림",
                    error.response?.data?.message ?? "냉장고 등록 중 오류가 발생했습니다.",
                );
                return;
            }

            Alert.alert("알림", "알 수 없는 오류가 발생했습니다.");
        }
    };
    const disabled = !(name ?? "").trim();


    return (
        <BottomSheetModal
            ref={ref}
            onDismiss={reset}
            snapPoints={snapPoints}
            handleComponent={() => null}
            enablePanDownToClose
            backdropComponent={props => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    pressBehavior="close"
                />
            )}>
            <BottomSheetView className="flex-1 bg-bg-paper rounded-t-[32px]">
                <View className={"flex-1 px-6 pb-8"}>
                    {/* Handle */}
                    <View className="items-center mb-6">
                        <View className="mt-2.5 h-1.5 w-14 rounded-full bg-divider" />
                    </View>

                    {/* 제목 */}
                    <Text className="mb-8 text-center text-[24px] font-bold text-text-default">
                        냉장고 추가
                    </Text>

                    {/* 라벨 */}
                    <Text className="mb-3 text-[16px] font-semibold text-text-default">
                        냉장고 이름
                    </Text>

                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <TextInput
                                value={field.value}
                                onChangeText={field.onChange}
                                maxLength={10}
                                placeholder="냉장고 이름을 입력해주세요"
                                placeholderTextColor="#B6B6B6"
                                className="h-14 rounded-[18px] border border-divider px-5 text-[16px] text-text-default"
                            />
                        )}
                    />
                    {errors.name && (
                        <Text className="mt-2 text-sm text-error-point">{errors.name.message}</Text>
                    )}

                    {/* 글자수 */}
                    <Text className="mt-2 text-right text-text-secondary">
                        {(name ?? "").length} / 10
                    </Text>

                    <View className="mt-2 flex-row gap-4">
                        <Pressable
                            onPress={onClose}
                            className="flex-1 h-14 items-center justify-center rounded-[18px] bg-bg-button">
                            <Text className="text-[18px] font-semibold text-text-default">
                                취소
                            </Text>
                        </Pressable>

                        <Pressable
                            disabled={disabled}
                            className="flex-1 h-14 items-center justify-center rounded-[18px] bg-primary-main"
                            onPress={handleSubmit(onSubmit)}>
                            <Text className="text-[18px] font-semibold text-text-contrast">
                                저장
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

AddFridgeSheet.displayName = "AddFridgeSheet";

export default AddFridgeSheet;
