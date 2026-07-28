import { TextInput, TextInputProps, View } from "react-native";
import { INPUT_SIZE_STYLE, StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

interface InputProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
    searchIcon?: ReactNode;
    hideBorder?: boolean;
}

function Input({
    hasError,
    size = "small",
    className,
    placeholderClassName,
    searchIcon,
    hideBorder,
    ...props
}: InputProps) {
    return (
        <View
            className={twMerge(
                ["w-full", "flex-row"],
                ["items-center"],
                ["rounded-[18px]"],
                ["bg-bg-paper"],
                !hideBorder && "border border-divider",
                hasError ? "border-error-point" : "border-divider focus:border-primary-main",
            )}>
            {searchIcon && <View className={"pl-4"}>{searchIcon}</View>}
            <TextInput
                className={twMerge(
                    ["flex-1", "text-text-default"],
                    INPUT_SIZE_STYLE[size],
                    className,
                )}
                placeholderClassName={twMerge("text-text-subtle", placeholderClassName)}
                {...props}
            />
        </View>
    );
}

export default Input;
