import { create } from "zustand";

interface LayoutState {
    showMainHeader: boolean;
    showDesktopHeader: boolean;
    showMainFooter: boolean;
    setLayout: (config: Partial<Omit<LayoutState, "setLayout">>) => void;
}

export const useLayoutStore = create<LayoutState>(set => ({
    showMainHeader: false, // 기본적으로 홈 화면 헤더 끔
    showDesktopHeader: false,
    showMainFooter: true, // 기본적으로 푸터 노출

    setLayout: config => set(state => ({ ...state, ...config })),
}));



