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
    const currentHeader = useLayoutStore(state => state.showMainHeader);
    const currentFooter = useLayoutStore(state => state.showMainFooter);
    const setLayout = useLayoutStore(state => state.setLayout);

    useFocusEffect(
        useCallback(() => {
            // 💡 만약 전달되지 않았다면(undefined) 기존 상태를 그대로 유지합니다!
            setLayout({
                showMainHeader: showMainHeader ?? currentHeader,
                showMainFooter: showMainFooter ?? currentFooter,
            });
        }, [showMainHeader, showMainFooter, currentHeader, currentFooter, setLayout]),
    );
};
