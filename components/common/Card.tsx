import { View, ViewProps } from "react-native";
import { shadows } from "@/styles/shadows";
import { twMerge } from "tailwind-merge";

type ShadowSize = "none" | "sm" | "md" | "lg";

interface CardProps extends ViewProps {
    children: React.ReactNode;
    shadow?: ShadowSize;
    className?: string;
}

export default function Card({ children, shadow = "sm", style, className, ...props }: CardProps) {
    return (
        <View
            style={[shadows[shadow], style]}
            className={twMerge("rounded-[36px] bg-bg-paper", className)}
            {...props}>
            {children}
        </View>
    );
}
