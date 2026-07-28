import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";

export const useSetupLayout = ({
    showMainHeader = false, // 💡 아무것도 안 넘기면 무조건 false (헤더 꺼짐)
    showMainFooter = true, // 💡 아무것도 안 넘기면 무조건 true (푸터 켜짐)
}: {
    showMainHeader?: boolean;
    showMainFooter?: boolean;
} = {}) => {
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
