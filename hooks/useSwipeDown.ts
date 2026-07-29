import { useRef } from "react";
import { PanResponder, GestureResponderHandlers } from "react-native";

export const useSwipeDown = (onClose: () => void): GestureResponderHandlers => {
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            // 10px 이상 아래로 움직였을 때만 제스처 가로채기
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 10;
            },
            // 50px 이상 스와이프하면 닫기
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 50) {
                    onCloseRef.current();
                }
            },
        }),
    ).current;

    // View 컴포넌트에 바로 전개 구문(...)으로 넣을 수 있도록 panHandlers만 반환
    return panResponder.panHandlers;
};
