import { Pressable, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { getAnimalIcon } from "@/constants/profile";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import TextComponent from "@/components/common/text/TextComponent"; // 👈 커스텀 컴포넌트 임포트!

interface UserProfileProps {
    userId?: number;
    userName: string;
    fridgeName: string;
    isFridgeOpen: boolean;
    onPress: () => void;
}

export default function HeaderProfile({
    userId,
    userName,
    fridgeName,
    isFridgeOpen,
    onPress,
}: UserProfileProps) {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);

    return (
        <View className="flex-row flex-1">
            <Pressable className="h-[65px] w-[65px] overflow-hidden rounded-full bg-bg-default">
                <Image
                    source={getAnimalIcon(isLoggedIn ? userId : undefined)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                />
            </Pressable>

            <View className="ml-4 justify-center">
                {!isLoggedIn ? (
                    // 🚨 [비로그인 상태]
                    <View className="gap-1">
                        <TextComponent className="text-[20px] font-bold text-text-default">
                            안녕하세요!
                        </TextComponent>
                        <TextComponent className="text-[13px] text-text-secondary mt-0.5">
                            로그인하고 냉장고를 관리해보세요.
                        </TextComponent>
                    </View>
                ) : (
                    // ✅ [로그인 상태]
                    <View className="gap-1">
                        <TextComponent className="text-[22px] font-bold text-text-default">
                            {userName}님
                        </TextComponent>

                        <View className="relative z-50 self-start">
                            <Pressable
                                onPress={onPress}
                                className={twMerge(
                                    "mt-1 flex-row items-center rounded-full border border-[#A18F8F] px-3 py-1",
                                )}>
                                <TextComponent className="mr-1 text-sm font-medium text-text-default">
                                    {fridgeName}
                                </TextComponent>

                                <Ionicons
                                    name={isFridgeOpen ? "chevron-up" : "chevron-down"}
                                    size={14}
                                    color="#A18F8F"
                                />
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}
