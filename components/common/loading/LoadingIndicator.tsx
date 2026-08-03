import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";
import { twMerge } from "tailwind-merge";

interface LoadingIndicatorProps extends ActivityIndicatorProps {
    fullScreen?: boolean;
}

function LoadingIndicator({
    fullScreen = false,
    size = "large",
    color = "#F79C79",
    className,
    ...props
}: LoadingIndicatorProps) {
    if (fullScreen) {
        return (
            <View
                className={twMerge(
                    ["absolute", "z-50", "inset-0"],
                    ["justify-center", "items-center"],
                    className,
                )}>
                {/* 배경 */}
                <View
                    className={twMerge(
                        ["absolute", "inset-0"],
                        ["bg-bg-default", "opacity-70"],
                    )}></View>
                {/* 스피너 */}
                <ActivityIndicator size={size} color={color} {...props} />
            </View>
        );
    }

    return (
        <View className={twMerge(["py-40", "justify-center", "items-center"], className)}>
            <ActivityIndicator size={size} color={color} {...props} />
        </View>
    );
}

export default LoadingIndicator;
