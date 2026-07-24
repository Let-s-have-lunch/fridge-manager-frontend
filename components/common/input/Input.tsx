import { TextInput, TextInputProps } from "react-native";
import { StyleSizeType } from "@/types/style";
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
    ...props}: InputProps) {
    return (
        <TextInput className={twMerge(
            "w-full bg-background-paper rounded-[18px]"
    );
}

export default Input;