import { View } from "react-native";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

interface ContentContainerProps {
    children: ReactNode;
    className?: string;
}

function ContentContainer({ children, className }: ContentContainerProps) {
    return (
        <View
            className={twMerge([
                "flex-1",
                "w-full",
                "max-w-7xl",
                "p-[20px]",
                "self-center",
                "bg-background-default",
                className,
            ])}>
            {children}
        </View>
    );
}

export default ContentContainer;
