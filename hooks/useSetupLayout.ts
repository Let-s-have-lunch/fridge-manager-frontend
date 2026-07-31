import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useLayoutStore } from "@/stores/layout/useLayoutStore";

export const useSetupLayout = ({
    showMainHeader ,
    showDesktopHeader,
    showMainFooter ,
}: {
    showMainHeader?: boolean;
    showDesktopHeader?: boolean;
    showMainFooter?: boolean;
}) => {
    const setLayout = useLayoutStore(state => state.setLayout);

    useFocusEffect(
        useCallback(() => {
            setLayout({
                ...(showMainHeader !== undefined && { showMainHeader }),
                ...(showDesktopHeader !== undefined && { showDesktopHeader }),
                ...(showMainFooter !== undefined && { showMainFooter }),
            });

            // 💡 화면에서 나갈 때(Clean-up): 앱의 원래 기본값으로 원상복구!
            return () => {
                setLayout({
                    showMainHeader: false,
                    showDesktopHeader: false,
                    showMainFooter: true,
                });
            };
        }, [setLayout, showMainHeader, showDesktopHeader, showMainFooter]),
    );
};
