import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export type ThemeType = "light" | "dark";

type ThemeState = {
    theme: ThemeType;
    onChangeTheme: () => void;
};

const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

export const useThemeStore = create<ThemeState>()(
    persist(
        set => ({
            theme: "light",
            onChangeTheme: () =>
                set(state => ({ theme: state.theme === "light" ? "dark" : "light" })),
        }),
        {
            name: "fridge-manager-theme-storage",
            storage,
        },
    ),
);
