import { TextInput, TextInputProps } from "react-native";
import { INPUT_SIZE_STYLE, StyleSizeType } from "@/types/style";
import { twMerge } from "tailwind-merge";

interface InputProps extends TextInputProps {
    hasError?: boolean;
    size?: StyleSizeType;
}

function Input({
    hasError,
    size = "medium",
    className,
    placeholderClassName,
    ...props
}: InputProps) {
    return (
        <TextInput
            className={twMerge(
                "w-full bg-background-paper rounded-[18px] border border-divider text-text-default",
                INPUT_SIZE_STYLE[size],
                hasError ? "border-error-main" : "border-primary-main focus:border-primary-main",
                className,
            )}
            placeholderClassName={twMerge("text-text-secondary", placeholderClassName)}
            {...props}></TextInput>
    );
}

export default Input;
