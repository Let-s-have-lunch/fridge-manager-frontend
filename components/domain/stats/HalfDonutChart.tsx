import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

interface Props {
    consumed: number;
    discarded: number;
    others: number;
}

const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
) => {
    const angleInRadians = ((angleInDegrees - 180) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
};

const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) => {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    return ["M", start.x, start.y, "A", radius, radius, 0, 0, 1, end.x, end.y].join(" ");
};

export default function HalfDonutChart({ consumed, discarded, others }: Props) {
    // 💡 차트 컬러 (Tailwind 테마 색상 헥스코드)
    const COLOR_CONSUMED = "#8AB4F8";
    const COLOR_DISCARDED = "#FDBA74";
    const COLOR_OTHERS = "#A7D7A9";

    const consumedAngle = (consumed / 100) * 180;
    const discardedAngle = (discarded / 100) * 180;

    const consumedStart = 0;
    const consumedEnd = consumedAngle;

    const discardedStart = consumedEnd;
    const discardedEnd = discardedStart + discardedAngle;

    const othersStart = discardedEnd;
    const othersEnd = 180;

    const cx = 150;
    const cy = 130;
    const r = 100;
    const strokeWidth = 30;

    return (
        <View className="items-center justify-center">
            <Svg width={300} height={150}>
                {/* 1. 소비 */}
                <Path
                    d={describeArc(cx, cy, r, consumedStart, consumedEnd)}
                    fill="none"
                    stroke={COLOR_CONSUMED}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                />
                {/* 2. 폐기 */}
                <Path
                    d={describeArc(cx, cy, r, discardedStart, discardedEnd)}
                    fill="none"
                    stroke={COLOR_DISCARDED}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                />
                {/* 3. 기타 */}
                <Path
                    d={describeArc(cx, cy, r, othersStart, othersEnd)}
                    fill="none"
                    stroke={COLOR_OTHERS}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                />
            </Svg>
        </View>
    );
}
