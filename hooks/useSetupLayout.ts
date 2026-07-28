import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";

export const useSetupLayout = ({
    showMainHeader,
    showMainFooter,
}: {
    showMainHeader?: boolean;
    showMainFooter?: boolean;
}) => {
    const setLayout = useLayoutStore(state => state.setLayout);

    useFocusEffect(
        useCallback(() => {
            setLayout({
                ...(showMainHeader !== undefined && { showMainHeader }),
                ...(showMainFooter !== undefined && { showMainFooter }),
            });
        }, [showMainHeader, showMainFooter, setLayout]),
    );
};
