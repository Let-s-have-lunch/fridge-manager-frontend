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
    textClassName?: string;
}

export const SQUARE_SIZE_STYLE = {
    small: "rounded-[15px] px-3 py-3",
    medium: "rounded-[15px] px-3 py-3",
    large: "rounded-[20px] px-5 py-4",
    fab: "rounded-full w-16 h-16",
};

export const CIRCLE_SIZE_STYLE = {
    small: "rounded-full w-10 h-10",
    medium: "rounded-full w-14 h-14",
    large: "rounded-full w-20 h-20",
    fab: "rounded-full w-16 h-16",
};

function Button({
    color = "primary",
    variant = "contained-square",
    size = "medium",
    fullWidth = false,
    wrap = false,
    textClassName,
    className,
    children,
    ...props
}: Props) {
    const getSizeClasses = () => {
        // 👉 [추가]: outlined 일 때도 네모 버튼과 동일한 크기를 가지도록 합쳐줍니다.
        if (variant === "contained-square" || variant === "outlined")
            return SQUARE_SIZE_STYLE[size];
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
        // 👉 [수정]: outlined일 때는 옅은 테두리와 종이(paper) 배경을, 아닐 때는 원래대로 꽉 찬 색상을 줍니다.
        variant === "outlined" ? `bg-bg-paper border border-divider` : `bg-${color}-main`,
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
                    // 👉 [수정]: outlined일 때는 글씨를 어두운 회색으로, 꽉 찬 버튼은 흰색으로 줍니다.
                    // (참고: 기존 color-white 대신 테일윈드 정식 클래스인 text-white를 사용했습니다)
                    variant === "outlined" ? "text-text-secondary" : "text-white",
                    // 👉 [꿀팁]: 기존 2xl, 3xl은 버튼 텍스트 치고 너무 거대해서 화면을 깨뜨릴 수 있습니다! 보통 아래 크기를 많이 씁니다.
                    size === "small" ? "text-sm" : size === "large" ? "text-lg" : "text-base",
                    textClassName,
                )}>
                {children}
            </Text>
        );
    } else if (React.isValidElement(children)) {
        const childElement = children as React.ReactElement<any>;

        const overrideProps: any = {
            size: childElement.props.size || getIconSize(),
        };

        if (childElement.props.color) {
            overrideProps.color = childElement.props.color;
        } else if (variant === "outlined") {
            // 👉 [추가]: outlined 버튼 안에 아이콘이 있으면 아이콘도 회색으로 맞춰줍니다.
            overrideProps.color = "#777777";
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
