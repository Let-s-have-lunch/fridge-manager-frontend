import { Pressable, View, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import { getAnimalIcon } from "@/constants/profile";

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
    return (
        <View className="flex-row flex-1">
            <Pressable className="h-[65px] w-[65px] overflow-hidden rounded-full bg-bg-default">
                <Image
                    source={getAnimalIcon(userId)}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                />
            </Pressable>

            <View className="ml-4 justify-center">
                <View className="gap-1">
                    <Text className="text-[22px] font-bold text-text-default">{userName}님</Text>

                    <View className="relative z-50 self-start">
                        <Pressable
                            onPress={onPress}
                            className={twMerge(
                                "mt-1 flex-row items-center rounded-full border border-[#A18F8F] px-3 py-1",
                            )}>
                            <Text className="mr-1 text-sm font-medium text-text-default">
                                {fridgeName}
                            </Text>

                            <Ionicons
                                name={isFridgeOpen ? "chevron-up" : "chevron-down"}
                                size={14}
                                color="#A18F8F"
                            />
                        </Pressable>
                    </View>
                </View>
                {/*<Text className="mt-1 text-[13px] text-text-secondary">*/}
                {/*    오늘도 신선한 하루되세요!*/}
                {/*</Text>*/}
            </View>
        </View>
    );
}
