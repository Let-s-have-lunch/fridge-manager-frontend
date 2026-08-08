import { Slot, useRouter } from "expo-router";
import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import LoadingIndicator from "@/components/common/loading/LoadingIndicator";
import { useEffect } from "react";
import AdminAsideDesktop from "@/components/layout/admin/AdminAsideDesktop";
import AdminAsideMobile from "@/components/layout/admin/AdminAsideMobile";

function AdminLayout() {
    const { user, isInitialized } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized) {
            if (!user || user.role !== "ADMIN") {
                router.replace("/");
            }
        }
    }, [isInitialized, user, router]);

    if (!isInitialized) {
        return <LoadingIndicator fullScreen={true} />;
    }

    if (!user || user.role !== "ADMIN") {
        return null;
    }

    return (
        <View className={twMerge(["flex-1", "flex-col", "md:flex-row", "bg-bg-default"])}>
            <View className={twMerge("hidden", "md:flex", "h-full")}>
                <AdminAsideDesktop />
            </View>

            <View className={twMerge("flex", "md:hidden", "w-full", "z-50")}>
                <AdminAsideMobile />
            </View>

            <View className="flex-1 bg-bg-default items-center">
                <View className="flex-1 w-full max-w-5xl p-6 md:p-8">
                    <Slot />
                </View>
            </View>
        </View>
    );
}

export default AdminLayout;
