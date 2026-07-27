import { PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import * as SplashScreen from "expo-splash-screen";
import api from "@/api/axiosInstance";
import { useRouter } from "expo-router";

void SplashScreen.preventAutoHideAsync();

export default function AuthProvider({ children }: PropsWithChildren) {
    const router = useRouter();
    const { isInitialized, isLoggedIn, token, logout } = useAuthStore();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        const checkAuthValidity = async () => {
            if (!isInitialized) return;

            if (!isLoggedIn || !token) {
                setIsAuthChecked(true);
                return;
            }

            try {
                const response = await api.get("/users/me");
                const latestUser = response.data.data;

                useAuthStore.setState({ user: latestUser });
            } catch (error) {
                console.error("토큰 검증 실패:", error);

                logout();
                router.replace("/auth/login");
            } finally {
                setIsAuthChecked(true);
            }
        };

        checkAuthValidity().then(() => {});
    }, [isInitialized, isLoggedIn, token, logout]);

    useEffect(() => {
        if (isInitialized && isAuthChecked) {
            void SplashScreen.hideAsync();
        }
    }, [isInitialized, isAuthChecked]);

    if (!isInitialized || !isAuthChecked) {
        return null;
    }

    return <>{children}</>;
}
