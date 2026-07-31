import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform, Appearance } from "react-native";

export type ThemeType = "light" | "dark";

type ThemeState = {
    theme: ThemeType;
    onChangeTheme: () => void;
};

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

// 👉 [추가된 부분]: 앱이 처음 실행될 때 기기의 시스템 테마가 무엇인지 확인합니다.
const systemTheme = Appearance.getColorScheme();

export const useThemeStore = create<ThemeState>()(
    persist(
        set => ({
            theme: systemTheme === "dark" ? "dark" : "light",
            onChangeTheme: () =>
                set(state => ({ theme: state.theme === "light" ? "dark" : "light" })),
        }),
        {
            name: "fridge-manager-theme-storage",
            storage,
        },
    ),
);



