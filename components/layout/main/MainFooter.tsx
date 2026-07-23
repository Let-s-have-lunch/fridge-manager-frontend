import { View, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

interface Props {
    className?: string;
}

export default function MainFooter({ className }: Props) {
    const router = useRouter();
    const pathname = usePathname();

    // 탭바에 들어갈 메뉴 정보 배열 (피그마 디자인 순서: 홈, 목록, 통계, 설정)
    const tabs = [
        { name: "홈", path: "/", icon: "home" as const },
        { name: "목록", path: "/list", icon: "calendar" as const }, // 프로젝트 경로에 맞게 수정 가능
        { name: "통계", path: "/stats", icon: "pie-chart" as const },
        { name: "설정", path: "/settings", icon: "settings" as const },
    ];

    return (
        <View
            className={twMerge(
                "w-full h-[84px] bg-bg-default justify-center items-center px-[20px]",
                className,
            )}>
            <View className="w-full max-w-7xl flex-row items-center justify-around">
                {tabs.map(tab => {
                    const isActive = pathname === tab.path;

                    return (
                        <TouchableOpacity
                            key={tab.path}
                            onPress={() => router.push(tab.path as any)}
                            activeOpacity={0.7}
                            className="items-center justify-center py-2 px-4">
                            <Feather
                                name={tab.icon}
                                size={40}
                                color={isActive ? "#EF7D6D" : "#A18F8F"}
                            />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
