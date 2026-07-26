import { TextProps, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { StyleSizeType } from "@/types/style";

interface ErrorMessageProps extends TextProps {
    size?: StyleSizeType;
}

function ErrorMessage({ size = "small", className, children, ...props }: ErrorMessageProps) {
    const ERROR_SIZE_STYLES = {
        mini: "text-[10px] mt-0.5",
        small: "text-[11px] mt-1",
        medium: "text-[11px] mt-2",
        large: "text-xs mt-3",
    };

    return (
        <Text
            className={twMerge("text-error-point ml-4.5", ERROR_SIZE_STYLES[size], className)}
            {...props}>
            {children}
        </Text>
    );
}

export default ErrorMessage;
