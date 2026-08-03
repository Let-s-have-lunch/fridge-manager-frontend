import { View, ViewProps } from "react-native";
import { twMerge } from "tailwind-merge";
import TextComponent from "@/components/common/text/TextComponent";

export type ExpireStatusType = "expired" | "soon" | "warning" | "safe";

interface ExpireBadgeProps extends ViewProps {
    status: ExpireStatusType;
    textClasses?: string;
}

function ExpireBadge({ status, className, textClasses, children, ...props }: ExpireBadgeProps) {
    // 상태에 따른 컨테이너(배경 및 테두리) 색상 클래스
    const getContainerClasses = () => {
        switch (status) {
            case "expired":
                return "bg-expire-expired-bg border border-expire-expired-text";
            case "soon":
                return "bg-expire-soon-bg border border-expire-soon-text";
            case "warning":
                return "bg-expire-warning-bg border border-expire-warning-text";
            case "safe":
                return "bg-expire-safe-bg border border-expire-safe-text";
            default:
                return "bg-transparent border border-transparent";
        }
    };

    // 상태에 따른 텍스트 색상 클래스
    const getTextColorClasses = () => {
        switch (status) {
            case "expired":
                return "text-expire-expired-text";
            case "soon":
                return "text-expire-soon-text";
            case "warning":
                return "text-expire-warning-text";
            case "safe":
                return "text-expire-safe-text";
            default:
                return "text-text-default";
        }
    };

    return (
        <View
            className={twMerge(
                // 이미지 비율에 맞춘 기본 레이아웃 및 패딩
                ["justify-center", "items-center", "flex-row"],
                ["rounded-full px-3 py-1.5"],
                getContainerClasses(),
                className,
            )}
            {...props}>
            {typeof children === "string" ? (
                <TextComponent
                    className={twMerge(
                        "font-bold text-sm", // 기본 폰트 스타일 (필요시 조절 가능)
                        getTextColorClasses(),
                        textClasses,
                    )}>
                    {children}
                </TextComponent>
            ) : (
                children
            )}
        </View>
    );
}

export default ExpireBadge;
