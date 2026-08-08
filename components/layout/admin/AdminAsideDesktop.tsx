import { Pressable, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Link, usePathname, Href } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import TextComponent from "@/components/common/text/TextComponent";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import Button from "@/components/common/button/Button";
import { ADMIN_NAV_LIST } from "@/constants/menu";

function AdminAsideDesktop() {
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    return (
        <View
            className={twMerge(
                "w-[250px] h-full flex-col justify-between",
                "bg-bg-subtle border-r border-divider",
            )}>
            {/* 상단 영역 */}
            <View>
                {/* 관리자 센터 헤더 */}
                <Link
                    href={"/admin"}
                    asChild
                    className={twMerge(
                        "flex-row h-20 items-center",
                        "border-b border-divider",
                        "bg-bg-subtle",
                    )}>
                    <Pressable>
                        <TextComponent className={twMerge("text-xl font-bold")}>
                            <Ionicons
                                name={"shield-half"}
                                size={22}
                                className={twMerge("pr-2 pl-5 text-text-default")}
                            />
                             관리자 센터
                        </TextComponent>
                    </Pressable>
                </Link>

                {/* 관리자 메뉴 영역 */}
                <View className={twMerge("px-3 py-4 gap-1", "bg-bg-default")}>
                    {ADMIN_NAV_LIST.map(item => {
                        const isActive =
                            item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);

                        return (
                            <Link href={item.path as Href} key={item.path} asChild>
                                <Pressable
                                    className={twMerge(
                                        "flex-row items-center gap-3 px-4 py-3.5",
                                        "rounded-xl transition-all",
                                        isActive ? "bg-primary-main" : "hover:bg-bg-subtle",
                                    )}>
                                    <Feather
                                        name={item.icon as any}
                                        size={18}
                                        className={isActive ? "text-white" : "text-text-secondary"}
                                    />

                                    <TextComponent
                                        className={twMerge(
                                            "font-bold",
                                            isActive ? "text-white" : "text-text-default",
                                        )}>
                                        {item.label}
                                    </TextComponent>
                                </Pressable>
                            </Link>
                        );
                    })}
                </View>
            </View>

            {/* 관리자 프로필 / 로그아웃 */}
            <View
                className={twMerge(
                    "p-4 m-4",
                    "border border-divider",
                    "rounded-2xl",
                    "bg-bg-default",
                )}>
                <View className={twMerge("flex-row items-center gap-3 mb-3")}>
                    <View
                        className={twMerge(
                            "justify-center items-center",
                            "w-10 h-10 rounded-full",
                            "bg-primary-main",
                        )}>
                        <Feather name={"shield"} size={18} color={"white"} />
                    </View>

                    <View>
                        <TextComponent className="text-sm font-bold">
                            {user?.nickname}
                        </TextComponent>

                        <TextComponent className="text-xs text-text-secondary">
                            {user?.email}
                        </TextComponent>
                    </View>
                </View>

                <Button fullWidth={true} onPress={logout} variant={"outlined"}>
                    로그아웃
                </Button>
            </View>
        </View>
    );
}

export default AdminAsideDesktop;
