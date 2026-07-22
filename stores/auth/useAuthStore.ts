import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { User } from "@/types/user";

type AuthState = {
    isLoggedIn: boolean;
    token: string | null;
    user: User | null;
    login: (user: User, token: string) => void;
    logout: () => void;
};

// 실행 환경(Web vs App)에 따라 저장소 분기 처리
const storage =
    Platform.OS === "web"
        ? createJSONStorage(() => localStorage)
        : createJSONStorage(() => AsyncStorage);

export const useAuthStore = create<AuthState>()(
    persist(
        set => ({
            isLoggedIn: false,
            token: null,
            user: null,
            login: (user, token) => set({ isLoggedIn: true, token, user }),
            logout: () => set({ isLoggedIn: false, token: null, user: null }),
        }),
        {
            name: "auth-storage",
            storage, // 환경에 맞는 저장소 매칭
        },
    ),
);
