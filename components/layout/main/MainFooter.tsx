import { View, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { tabs } from "@/constants/menu";

interface Props {
    className?: string;
}

export default function MainFooter({ className }: Props) {
    const router = useRouter();
    const pathname = usePathname();

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
