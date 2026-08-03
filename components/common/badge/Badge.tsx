import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";
import { StyleColorType, StyleSizeType } from "@/types/style";

interface BadgeProps extends ViewProps {
    color?: StyleColorType;
    size?: StyleSizeType;
    textClass?: string;
}

function Badge({
    color = "primary",
    size = "small",
    textClass,
    className,
    children,
    ...props
}: BadgeProps) {
    const getBgColorClasses = (color: StyleColorType) => {
        return `bg-${color}-main border border-${color}-main`;
    };
    const getTextColorClasses = (color: StyleColorType) => {
        return `text-${color}-contrast`;
    };

    const CONTAINER_SIZE_STYLES = {
        small: "px-2 py-0.5",
        medium: "px-2.5 py-1",
        large: "px-3 py-1.5",
    };

    const TEXT_SIZE_STYLES = {
        small: "text-[11px]",
        medium: "text-sm",
        large: "text-base",
    };

    return (
        <View
            className={twMerge(
                "rounded-full items-center justify-center",
                getBgColorClasses(color),
                CONTAINER_SIZE_STYLES[size],
                className,
            )}
            {...props}>
            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge(
                        "text-[11px] font-bold",
                        getTextColorClasses(color),
                        TEXT_SIZE_STYLES[size],
                        textClass,
                    )}>
                    {children}
                </TextComponent>
            ) : (
                children
            )}
        </View>
    );
}

export default Badge;
