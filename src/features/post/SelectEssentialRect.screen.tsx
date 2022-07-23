import React from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

function MovableImage() {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  const scale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: scale.value },
        // { scale: withSpring(isPressed.value ? 2 : 1) },
      ],
      backgroundColor: isPressed.value ? "yellow" : "blue",
    };
  });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      "worklet";
      isPressed.value = true;
    })
    .onChange((e) => {
      "worklet";
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };
    })
    .onFinalize(() => {
      "worklet";
      isPressed.value = false;
    });

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      "worklet";
    })
    .onChange((e) => {
      "worklet";
      scale.value *= e.scaleChange;
    })
    .onFinalize(() => {
      "worklet";
    });

  const composed = Gesture.Exclusive(panGesture, pinchGesture);

  return (
    <GestureDetector gesture={composed}>
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
  return (
    <View style={styles.container}>
      <MovableImage />
      <View style={styles.overlayContainer} pointerEvents="box-none">
        <View style={styles.overlay} pointerEvents="box-none" />
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
    alignSelf: "center",
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
    backgroundColor: "red",
  },
});
