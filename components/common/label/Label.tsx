import { TextProps } from "react-native";
import { StyleSizeType } from "@/types/style";

interface LabelProps extends TextProps {
    size?: StyleSizeType;
}

function Label({ size = "medium", className, children, ...props }: LabelProps) {
    const LABEL_SIZE_STYLES = {
        mini: "text-sm mb-1",
    };
}

export default Label;