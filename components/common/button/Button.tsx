import React from "react";
import { StyleColorType, StyleSizeType, StyleVariantType } from "@/types/style";
import { Pressable, PressableProps, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface Props extends PressableProps {
    color?: StyleColorType;
    variant?: StyleVariantType;
    size?: StyleSizeType;
    fullWidth?: boolean;
    wrap?: boolean;
}

export const SQUARE_SIZE_STYLE = {
    small: "rounded-[15px] px-3 py-3",
    medium: "rounded-[15px] px-3 py-3",
    large: "rounded-[20px] px-5 py-4",
};

export const CIRCLE_SIZE_STYLE = {
    small: "rounded-full w-10 h-10",
    medium: "rounded-full w-14 h-14",
    large: "rounded-full w-20 h-20",
};

function Button({
    color = "primary",
    variant = "contained-square",
    size = "medium",
    fullWidth = false,
    wrap = false,
    className,
    children,
    ...props
}: Props) {
    const getSizeClasses = () => {
        if (variant === "contained-square") return SQUARE_SIZE_STYLE[size];
        if (variant === "contained-circle") return CIRCLE_SIZE_STYLE[size];
        if (variant === "icon-only") return "rounded-full bg-transparent p-2";
        return "";
    };

    const getIconSize = () => {
        if (size === "small") return 20;
        if (size === "large") return 32;
        return 24;
    };

    const containerClasses = twMerge(
        "flex justify-center items-center",
        `bg-${color}-main`,
        getSizeClasses(),
        fullWidth ? "w-full" : "",
        className,
        wrap && "flex-1",
    );

    let content = children;

    if (typeof children === "string") {
        content = (
            <Text
                className={twMerge(
                    "font-bold",
                    "color-white",
                    size === "small" ? "text-xl" : size === "large" ? "text-3xl" : "text-2xl",
                )}>
                {children}
            </Text>
        );
    } else if (React.isValidElement(children)) {
        const childElement = children as React.ReactElement<any>;

        // 새로 적용할 props를 객체로 정리
        const overrideProps: any = {
            size: childElement.props.size || getIconSize(),
        };

        // 아이콘에 color 속성이 직접 있으면 그걸 쓰고,
        // 없는데 만약 icon-only 버튼이 아니라면(일반 둥근/네모 버튼) white를 칠한다.
        // 즉, icon-only일 때는 강제로 color를 덮어씌우지 않고 내버려 둔다!
        if (childElement.props.color) {
            overrideProps.color = childElement.props.color;
        } else if (variant !== "icon-only") {
            overrideProps.color = "white";
        }

        content = React.cloneElement(childElement, overrideProps);
    }

    return (
        <Pressable className={containerClasses} {...props}>
            {content}
        </Pressable>
    );
}

export default Button;
