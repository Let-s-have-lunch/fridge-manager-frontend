import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { User } from "@/types/user";

type AuthState = {
    isInitialized: boolean;
    setInitialized: (status: boolean) => void;
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
            isInitialized: false,
            setInitialized: status => set({ isInitialized: status }),
            isLoggedIn: false,
            token: null,
            user: null,
            login: (user, token) => set({ isLoggedIn: true, token, user }),
            logout: () => {
                set({ isLoggedIn: false, token: null, user: null });
            },
        }),
        {
            name: "pet-health-app-auth-storage",
            storage,
            onRehydrateStorage: () => state => {
                state?.setInitialized(true);
            },
            partialize: state => ({
                isLoggedIn: state.isLoggedIn,
                token: state.token,
                user: state.user,
            }),
        },
    ),
);
