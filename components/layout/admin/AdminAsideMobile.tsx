import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Href, Link, usePathname } from "expo-router";
import TextComponent from "@/components/common/text/TextComponent";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import { ADMIN_NAV_LIST } from "@/constants/menu";
import Button from "@/components/common/button/Button";

function AdminAsideMobile() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout } = useAuthStore();

    const { width } = useWindowDimensions();
    useEffect(() => {
        if (width >= 768 && isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [width, isMenuOpen]);

    return (
        <>
            <View
                className={twMerge(
                    ["h-20", "px-4", "flex-row", "justify-between", "items-center"],
                    ["bg-bg-subtle", "border-b", "border-divider"],
                )}>
                <Link href={"/admin"} asChild>
                    <Pressable>
                        <TextComponent
                            className={twMerge("text-[18px]", "font-extrabold", "text-text-default")}>
                            <Ionicons
                                name={"shield-half"}
                                size={22}
                                className={twMerge(["pr-2", "pl-3.5", "text-text-default"])}
                            />
                            관리자 센터
                        </TextComponent>
                    </Pressable>
                </Link>
                <Pressable className={"p-2"} onPress={() => setIsMenuOpen(!isMenuOpen)}>
                    <Feather name={"menu"} size={24} className={"text-text-default"} />
                </Pressable>
            </View>

            <Modal visible={isMenuOpen} transparent={true} animationType={"slide"}>
                <View className={twMerge("flex-1", "justify-between", "bg-bg-default")}>
                    <View>
                        <View
                            className={twMerge(
                                ["h-20", "flex-row", "justify-between", "items-center", "px-4"],
                                ["border-b", "border-divider"],
                            )}>
                            <Link href={"/admin"} asChild onPress={() => setIsMenuOpen(false)}>
                                <Pressable>
                                    <TextComponent
                                        className={twMerge(
                                            "text-lg",
                                            "font-extrabold",
                                            "text-text-default",
                                        )}>
                                        <Ionicons
                                            name={"shield-half"}
                                            size={22}
                                            className={twMerge(["pr-2", "pl-2", "text-text-default"])}
                                        />
                                        관리자 센터
                                    </TextComponent>
                                </Pressable>
                            </Link>
                            <Pressable onPress={() => setIsMenuOpen(false)}>
                                <Feather name={"x"} size={24} className={"text-text-default"} />
                            </Pressable>
                        </View>
                        <View className={twMerge("px-3 py-4 gap-1")}>
                            {ADMIN_NAV_LIST.map(item => {
                                const isActive =
                                    item.path === "/"
                                        ? pathname === "/"
                                        : pathname.startsWith(item.path);

                                return (
                                    <Link
                                        href={item.path as Href}
                                        key={item.path}
                                        asChild
                                        onPress={() => setIsMenuOpen(false)}>
                                        <Pressable
                                            className={twMerge(
                                                ["flex-row", "items-center", "gap-3"],
                                                ["p-4", "rounded-xl"],
                                                isActive
                                                    ? "bg-primary-main"
                                                    : "hover:bg-bg-subtle active:bg-background-default",
                                            )}>
                                            <Feather
                                                name={item.icon as any}
                                                size={20}
                                                className={
                                                    isActive
                                                        ? "text-primary-contrast"
                                                        : "text-text-secondary"
                                                }
                                            />
                                            <TextComponent
                                                className={twMerge(
                                                    "font-bold",
                                                    isActive
                                                        ? "text-primary-contrast"
                                                        : "text-text-secondary",
                                                )}>
                                                {item.label}
                                            </TextComponent>
                                        </Pressable>
                                    </Link>
                                );
                            })}
                        </View>
                    </View>

                    <View className={twMerge(["p-4"], ["border-t", "border-divider"])}>
                        <View className={twMerge("mb-4", ["flex-row", "items-center", "gap-3"])}>
                            <View
                                className={twMerge(
                                    ["w-12", "h-12", "justify-center", "items-center"],
                                    ["bg-primary-main", "rounded-full"],
                                )}>
                                <Feather name={"shield"} size={20} color={"white"} />
                            </View>
                            <View>
                                <TextComponent className={twMerge("font-bold")}>
                                    {user?.nickname}
                                </TextComponent>
                                <TextComponent
                                    className={twMerge("text-sm", "text-text-secondary")}>
                                    {user?.email}
                                </TextComponent>
                            </View>
                        </View>
                        <Button
                            variant={"outlined"}
                            color={"error"}
                            fullWidth={true}
                            size={"large"}
                            onPress={() => {
                                setIsMenuOpen(false);
                                logout();
                            }}
                            className={"border"}>
                            로그아웃
                        </Button>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default AdminAsideMobile;
