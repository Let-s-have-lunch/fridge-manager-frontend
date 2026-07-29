import { TextProps } from "react-native";
import { StyleSizeType } from "@/types/style";
import TextComponent from "@/components/common/text/TextComponent";
import { twMerge } from "tailwind-merge";

interface LabelProps extends TextProps {
    size?: StyleSizeType;
}
const LABEL_SIZE_STYLES = {
    mini: "text-sm mb-1",
    small: "text-sm mb-3",
    medium: "text-base mb-3.5",
    large: "text-lg mb-4",
};

function Label({ size = "small", className, children, ...props }: LabelProps) {

    return (
        <TextComponent
            className={twMerge(
                "font-semibold text-text-default ml-2", LABEL_SIZE_STYLES[size], className,
            )}{...props}>
            {children}
        </TextComponent>
    );
}

export default Label;