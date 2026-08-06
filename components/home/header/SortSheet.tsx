import { forwardRef, useMemo, useRef, useState, useImperativeHandle } from "react";
import {
    Pressable,
    View,
    Modal,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { twMerge } from "tailwind-merge";

import TextComponent from "@/components/common/text/TextComponent";
import { useThemeStore } from "@/stores/theme/useThemeStore";

export type SortType = "EXPIRE" | "CATEGORY";

interface SortSheetProps {
    selected: SortType;
    onSelect: (type: SortType) => void;
}

const SortSheet = forwardRef<BottomSheetModal, SortSheetProps>(({ selected, onSelect }, ref) => {
    const { width } = useWindowDimensions();
    const isMd = width >= 768; // md 사이즈 기준

    // 1. 상태 및 Ref 관리
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    // 2. 부모의 present() 호출 가로채기
    useImperativeHandle(ref, () => {
        return {
            present: () => {
                if (isMd) {
                    // md 이상이면 드롭다운 열기
                    setIsDropdownVisible(true);
                } else {
                    // 모바일이면 바텀 시트 열기
                    bottomSheetRef.current?.present();
                }
            },
            dismiss: () => {
                setIsDropdownVisible(false);
                bottomSheetRef.current?.dismiss();
            },
            close: () => {
                setIsDropdownVisible(false);
                bottomSheetRef.current?.close();
            },
        } as unknown as BottomSheetModal;
    }, [isMd]);

    const theme = useThemeStore(state => state.theme);
    const isDarkMode = theme === "dark";
    const snapPoints = useMemo(() => ["28%"], []);

    // 💡 글로벌 CSS 변수 기반 색상 매칭
    const bgColor = isDarkMode ? "#3A3532" : "#FFFFFF"; // --bg-paper
    const handleColor = isDarkMode ? "#5B534E" : "#ECE6DF"; // --divider

    const handleSelect = (type: SortType) => {
        onSelect(type);
        setIsDropdownVisible(false); // 선택 후 드롭다운 닫기
        bottomSheetRef.current?.dismiss();
    };

    if (isMd) {
        return (
            <Modal
                visible={isDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsDropdownVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
                    {/* 화면 전체 기준 중앙 정렬 후 헤더 본문과 동일한 max-w-6xl 뼈대 활용 */}
                    <View className="flex-1 items-center justify-start bg-transparent pt-[72px]">
                        <View className="w-full max-w-6xl items-end pr-5">
                            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                                <View
                                    style={{
                                        backgroundColor: bgColor,
                                        shadowColor: "#000",
                                        shadowOpacity: 0.1,
                                        shadowRadius: 15,
                                        shadowOffset: { width: 0, height: 4 },
                                        elevation: 5,
                                    }}
                                    className="w-[180px] overflow-hidden rounded-2xl border border-divider mt-2">
                                    <Pressable
                                        className={twMerge(
                                            "flex-row items-center justify-between px-4 py-3 active:bg-bg-subtle",
                                            selected === "EXPIRE" && "bg-button-subtle",
                                        )}
                                        onPress={() => handleSelect("EXPIRE")}>
                                        <TextComponent
                                            className={twMerge(
                                                "text-[15px]",
                                                selected === "EXPIRE"
                                                    ? "font-bold text-text-default"
                                                    : "text-text-secondary",
                                            )}>
                                            유통기한 순
                                        </TextComponent>
                                        {selected === "EXPIRE" && (
                                            <TextComponent className="text-primary-point font-bold">
                                                ✓
                                            </TextComponent>
                                        )}
                                    </Pressable>

                                    <Pressable
                                        className={twMerge(
                                            "flex-row items-center justify-between px-4 py-3 active:bg-bg-subtle",
                                            selected === "CATEGORY" && "bg-button-subtle",
                                        )}
                                        onPress={() => handleSelect("CATEGORY")}>
                                        <TextComponent
                                            className={twMerge(
                                                "text-[15px]",
                                                selected === "CATEGORY"
                                                    ? "font-bold text-text-default"
                                                    : "text-text-secondary",
                                            )}>
                                            카테고리 순
                                        </TextComponent>
                                        {selected === "CATEGORY" && (
                                            <TextComponent className="text-primary-point font-bold">
                                                ✓
                                            </TextComponent>
                                        )}
                                    </Pressable>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        );
    }

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            backdropComponent={props => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={0.3}
                />
            )}
            backgroundStyle={{
                backgroundColor: bgColor,
            }}
            handleIndicatorStyle={{
                backgroundColor: handleColor,
            }}>
            <View className={"flex-1"}>
                <BottomSheetView className="px-6 pt-2 bg-bg-paper">
                    <TextComponent className="mb-5 mt-1 px-5 text-lg font-bold text-text-default">
                        정렬 방식
                    </TextComponent>
                    <Pressable
                        className="flex-row items-center justify-between px-5 py-2 active:bg-bg-subtle rounded-xl"
                        onPress={() => handleSelect("EXPIRE")}>
                        <TextComponent
                            className={
                                selected === "EXPIRE"
                                    ? "font-bold text-text-default"
                                    : "text-text-secondary"
                            }>
                            유통기한 순
                        </TextComponent>
                        {selected === "EXPIRE" && (
                            <TextComponent className="text-primary-point font-bold">
                                ✓
                            </TextComponent>
                        )}
                    </Pressable>

                    <Pressable
                        className="flex-row items-center justify-between px-5 py-2 mb-5 active:bg-bg-subtle rounded-xl"
                        onPress={() => handleSelect("CATEGORY")}>
                        <TextComponent
                            className={
                                selected === "CATEGORY"
                                    ? "font-bold text-text-default"
                                    : "text-text-secondary"
                            }>
                            카테고리 순
                        </TextComponent>
                        {selected === "CATEGORY" && (
                            <TextComponent className="text-primary-point font-bold">
                                ✓
                            </TextComponent>
                        )}
                    </Pressable>
                </BottomSheetView>
            </View>
        </BottomSheetModal>
    );
});

SortSheet.displayName = "SortSheet";
export default SortSheet;
