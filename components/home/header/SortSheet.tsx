import { forwardRef, useMemo } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import TextComponent from "@/components/common/text/TextComponent";
import { useThemeStore } from "@/stores/theme/useThemeStore";

export type SortType = "EXPIRE" | "CATEGORY";

interface SortSheetProps {
    selected: SortType;
    onSelect: (type: SortType) => void;
}


const SortSheet = forwardRef<BottomSheetModal, SortSheetProps>(({ selected, onSelect }, ref) => {
    const theme = useThemeStore(state => state.theme);
    const isDarkMode = theme === "dark";
    const snapPoints = useMemo(() => ["28%"], []);

    return (
        <BottomSheetModal
            ref={ref}
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
                backgroundColor: isDarkMode ? "#1F1F1F" : "#FFFFFF",
            }}
            handleIndicatorStyle={{
                backgroundColor: isDarkMode ? "#666666" : "#DDDDDD",
            }}>
            <BottomSheetView className="px-6 pt-2">
                <TextComponent className="mb-5 mt-1 px-5 text-lg font-bold">정렬 방식</TextComponent>
                <Pressable
                    className="flex-row items-center justify-between px-5 py-2"
                    onPress={() => onSelect("EXPIRE")}>
                    <TextComponent>유통기한 순</TextComponent>

                    {selected === "EXPIRE" && <TextComponent>✓</TextComponent>}
                </Pressable>

                <Pressable
                    className="flex-row items-center justify-between px-5 py-2 mb-5"
                    onPress={() => onSelect("CATEGORY")}>
                    <TextComponent>카테고리 순</TextComponent>

                    {selected === "CATEGORY" && <TextComponent>✓</TextComponent>}
                </Pressable>
            </BottomSheetView>
        </BottomSheetModal>
    );
});

SortSheet.displayName = "SortSheet";
export default SortSheet;
