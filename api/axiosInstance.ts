import { create, isAxiosError } from "axios";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { Alert, Platform } from "react-native";
import { router } from "expo-router";

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

const api = create({
    baseURL: BASE_URL,
    timeout: 3000,
    withCredentials: true,
});

export default api;

api.interceptors.request.use(config => {
    const { token } = useAuthStore.getState();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
                const isLoginRequest = error.config?.url?.includes("/login");

                if (!isLoginRequest) {
                    useAuthStore.getState().logout();

                    if (Platform.OS === "web") {
                        window.alert("로그인 세션이 만료되었습니다. 다시 로그인 해주세요.");
                        router.replace("/auth/login");
                    } else {
                        Alert.alert("알림", "로그인 세션이 만료되었습니다. 다시 로그인 해주세요.", [
                            {
                                text: "확인",
                                onPress: () => router.replace("/auth/login"),
                            },
                        ]);
                    }
                }
            }
        }

        return Promise.reject(error);
    },
);
