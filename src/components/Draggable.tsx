/* eslint-disable react-native/no-inline-styles */
import React, {useRef, useState, PropsWithChildren} from 'react';
import {
  View,
  PanResponder,
  PanResponderGestureState,
  ViewStyle,
} from 'react-native';

type Direction =
  | 'any'
  | 'horizontal'
  | 'vertical'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom';

type DraggableProps = PropsWithChildren<{
  direction?: Direction;
  threshold?: number;
  style?: ViewStyle;
  onLeft?: () => void;
  onRight?: () => void;
  onTop?: () => void;
  onBottom?: () => void;
  onVertical?: (direction: string) => void;
  onHorizontal?: (direction: string) => void;
  onMove?: (gestureState: PanResponderGestureState) => void;
  onRelease?: (gestureState: PanResponderGestureState) => void;
}>;

const Draggable: React.FC<DraggableProps> = ({
  direction = 'horizontal',
  threshold = 100,
  style,
  onLeft,
  onRight,
  onTop,
  onBottom,
  onHorizontal,
  onVertical,
  onMove,
  onRelease,
  children,
}) => {
  const draggableRef = useRef<View>(null);
  const [position, setPosition] = useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });
  const [opacity, setOpacity] = useState<number>(1);
  const directionY = ['vertical', 'top', 'bottom'];
  const directionX = ['horizontal', 'left', 'right'];

  const getDirection = (dx: number, dy: number): Direction => {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'bottom' : 'top';
    }
  };

  const isValid = (pos: Direction): boolean => {
    if (direction === 'vertical') {
      return directionY.includes(pos);
    } else if (direction === 'horizontal') {
      return directionX.includes(pos);
    } else if (direction === 'any') {
      return true;
    } else if (pos === direction) {
      return true;
    } else {
      return false;
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: (_evt, gestureState) => {
        const dx = gestureState.dx;
        const dy = gestureState.dy;

        if (direction === 'horizontal') {
          return Math.abs(dx) > Math.abs(dy);
        }

        if (direction === 'left') {
          return dx < 0 && Math.abs(dx) > Math.abs(dy);
        }

        if (direction === 'right') {
          return dx > 0 && Math.abs(dx) > Math.abs(dy);
        }

        return true;
      },
      onPanResponderMove: (_evt, gestureState) => {
        onMove?.(gestureState);

        const dx = gestureState.dx;
        const dy = gestureState.dy;

        const currentPosition = getDirection(dx, dy);
        if (isValid(currentPosition)) {
          const newOpacity = 1 - Math.sqrt(dx * dx + dy * dy) / threshold;
          if (newOpacity > 0) {
            setOpacity(newOpacity);
          }
          setPosition({
            y: directionY.includes(direction) ? dy : 0,
            x: directionX.includes(direction) ? dx : 0,
          });
        }
      },
      onPanResponderRelease: (_evt, gestureState) => {
        onRelease?.(gestureState);

        const dx = gestureState.dx;
        const dy = gestureState.dy;

        const currentPosition = getDirection(dx, dy);
        if (isValid(currentPosition)) {
          if (directionY.includes(direction) && Math.abs(dy) >= threshold) {
            onHorizontal?.(currentPosition);
            if (dy > 0) {
              onBottom?.();
            } else {
              onTop?.();
            }
          } else if (
            directionX.includes(direction) &&
            Math.abs(dx) >= threshold
          ) {
            onVertical?.(currentPosition);
            if (dx > 0) {
              onRight?.();
            } else {
              onLeft?.();
            }
          }
        }
        setPosition({x: 0, y: 0});
        setOpacity(1);
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  return (
    <View
      ref={draggableRef}
      style={[
        style,
        {
          transform: [{translateX: position.x}, {translateY: position.y}],
          opacity: position.x !== 0 || position.y !== 0 ? opacity : 1,
        },
      ]}
      {...panResponder.panHandlers}>
      {children}
    </View>
  );
};

export default Draggable;
