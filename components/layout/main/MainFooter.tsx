import { View, TouchableOpacity, Platform , Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { useRouter, usePathname, Href } from "expo-router";
import { tabs } from "@/constants/tab";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
    className?: string;
}

export default function MainFooter({ className }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    return (
        <View
            className={twMerge(
                "w-full bg-bg-subtle justify-center items-center px-[20px]",
                className,
            )}

            style={{
                paddingBottom: Platform.OS === "ios" ? Math.max(insets.bottom, 10) : 10,
                paddingTop: 8,
            }}>
            <View className="w-full max-w-7xl flex-row items-center justify-around">
                {tabs.map(tab => {
                    // 하위 페이지(/schedule/detail)에 가도 탭 불이 안 꺼지도록 startsWith 적용
                    const isActive =
                        tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);

                    const color = isActive ? "#EF7D6D" : "#968787";
                    const { iconComponent: IconComponent, iconName } = tab;

                    return (
                        <TouchableOpacity
                            key={tab.path}
                            // as any를 빼고 안전한 타입캐스팅 적용
                            onPress={() => router.push(tab.path as Href)}
                            activeOpacity={0.7}
                            className="items-center justify-center py-1 gap-1 flex-1">
                            <IconComponent name={iconName as any} size={26} color={color} />
                            <Text
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.8}
                                style={{
                                    color: color,
                                    fontSize: 11,
                                    fontWeight: isActive ? "700" : "500",
                                    marginTop: 2,
                                }}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}