import { Slot } from "expo-router";
import "../styles/global.css";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import AuthProvider from "@/components/domain/auth/AuthProvider";

export default function RootLayout() {
    const { theme } = useThemeStore();
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        setColorScheme(theme);
    }, [theme, setColorScheme]);

    return (
        <SafeAreaProvider>
            <StatusBar style={theme === "dark" ? "light" : "dark"} />
            <SafeAreaView className={"flex-1 "}>
                <AuthProvider>
                    <Slot />
                </AuthProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
