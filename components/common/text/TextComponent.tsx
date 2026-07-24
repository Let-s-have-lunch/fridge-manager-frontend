import { Text, TextProps } from "react-native";
import { twMerge } from "tailwind-merge";

interface TextComponentProps extends TextProps {
    className?: string;
}

function TextComponent({ className, children, ...props }: TextComponentProps) {
    return (
        <Text className={twMerge("font-inter", "text-text-default", className)} {...props}>
            {children}
        </Text>
    );
}

export default TextComponent;
