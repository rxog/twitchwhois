import {colorAlpha, colors} from '@/assets/styles';
import React, {PropsWithChildren, useMemo} from 'react';
import {Pressable, View, StyleSheet} from 'react-native';
import PopoverComponent, {PopoverPlacement} from 'react-native-popover-view';

type PopoverProps = PropsWithChildren<{
  content: React.ReactNode;
}>;

export default function Popover({children, content}: PopoverProps) {
  const fromComponent = useMemo(() => {
    return (sourceRef: React.RefObject<View>, openPopover: () => void) => (
      <View ref={sourceRef}>
        {children}
        <Pressable
          style={StyleSheet.absoluteFill}
          onLongPress={openPopover}
          android_ripple={{color: colorAlpha(colors.light, 0.1)}}
        />
      </View>
    );
  }, [children]);

  return (
    <PopoverComponent placement={PopoverPlacement.CENTER} from={fromComponent}>
      <View style={styles.popover}>{content}</View>
    </PopoverComponent>
  );
}

const styles = StyleSheet.create({
  popover: {
    padding: 10,
  },
});
