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
    const COLOR_CONSUMED = "#A8C8E3";
    const COLOR_DISCARDED = "#F79C79";
    const COLOR_OTHERS = "#A8C9A2";

    const consumedAngle = (consumed / 100) * 180;
    const discardedAngle = (discarded / 100) * 180;

    const consumedStart = 0;
    const consumedEnd = consumedAngle;

    const discardedStart = consumedEnd;
    const discardedEnd = discardedStart + discardedAngle;

    const othersStart = discardedEnd;
    const othersEnd = 180;

    // 기존보다 약 10% 축소
    const cx = 135;
    const cy = 115;
    const r = 90;
    const strokeWidth = 27;

    return (
        <View className="items-center justify-center">
            <Svg width={270} height={135}>
                <Path
                    d={describeArc(cx, cy, r, consumedStart, consumedEnd)}
                    fill="none"
                    stroke={COLOR_CONSUMED}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                />

                <Path
                    d={describeArc(cx, cy, r, discardedStart, discardedEnd)}
                    fill="none"
                    stroke={COLOR_DISCARDED}
                    strokeWidth={strokeWidth}
                    strokeLinecap="butt"
                />

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