import React, { useState, useEffect } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { Size } from "../../infrastructure/types/geometry.types";

function MovableImage({clientSize, imageSize}: {clientSize: Size, imageSize: Size}) {

  const center = useSharedValue({ x: imageSize.width / 2, y: imageSize.height / 2 });
  const scale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    const imageOffsetX = center.value.x - imageSize.width / 2;
    const imageOffsetY = center.value.y - imageSize.height / 2;
    const translateX = (clientSize.width / 2) / scale.value - imageOffsetX;
    const translateY = (clientSize.height / 2) / scale.value - imageOffsetY;

    return {
      transform: [
        { translateX: - imageSize.width / 2 },
        { translateY: - imageSize.height / 2 },
        { scale: scale.value },
        { translateX: translateX },
        { translateY: translateY },
      ],
    };
  });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
    })
    .onChange((e) => {
      "worklet";
      center.value = {
        x: center.value.x - e.changeX / scale.value,
        y: center.value.y - e.changeY / scale.value,
      };
      console.log('center scale was ', scale.value, center.value)
    })
    .onFinalize(() => {
      "worklet";
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      "worklet";
    })
    .onChange((e) => {
      "worklet";
      scale.value *= e.scaleChange;
      console.log('scale', scale.value)
    })
    .onFinalize(() => {
      "worklet";
    });

  const composed = Gesture.Exclusive(panGesture, pinchGesture);

  return (
    <GestureDetector gesture={composed} style={{ flex: 1}}>
      <Animated.Image
        style={[styles.image, animatedStyles]}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/er-react-native.appspot.com/o/images2%2Fpic01_full.jpg?alt=media&token=509e811d-4dba-4687-8994-4549279cdf7b",
        }}
      />
    </GestureDetector>
  );
}

export function SelectEssentialRectScreen() {
  const [size, setSize] = useState<Size>();

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  useEffect(() => {}, []);

  return (
    <View style={styles.container} onLayout={onLayout}>
      { size && <MovableImage clientSize={size} imageSize={{ width: 1681, height: 1600 }} />}
      <View style={styles.overlayContainer} pointerEvents="none">
        <View style={styles.overlay}>
          <View style={styles.overlayVMargin} />
          <View style={styles.overlayVMiddle}>
            <View style={styles.overlayHMargin} />
            <View style={styles.overlayCenter} />
            <View style={styles.overlayHMargin} />
          </View>
          <View style={styles.overlayVMargin} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 1681,
    height: 1600,
  },
  overlayContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    opacity: 0.5,
  },
  overlay: {
    flex: 1,
  },
  overlayVMargin: {
    flexGrow: 1,
    backgroundColor: "black",
  },
  overlayVMiddle: {
    flexDirection: "row",
  },
  overlayHMargin: {
    flex: 1,
    backgroundColor: "black",
  },
  overlayCenter: {
    backgroundColor: "transparent",
    width: 300,
    height: 300,
  },
});
