import React, { useState, useRef, useContext } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { Size, Rect } from "../../infrastructure/types/geometry.types";
import { AuthenticationContext } from "../../services/authentication/authentication.context";

import { ImagesContext } from "../../services/images/images.context";

function MovableImage({
  uri,
  clientSize,
  imageSize,
  initialScale,
  onChange,
}: {
  uri: string;
  clientSize: Size;
  imageSize: Size;
  initialScale: number;
  onChange: (_: any) => void;
}) {
  const center = useSharedValue({
    x: imageSize.width / 2,
    y: imageSize.height / 2,
  });
  const scale = useSharedValue(initialScale);

  const reportToParent = () => {
    const left = Math.ceil(Math.max(0, center.value.x - 150 / scale.value));
    const top = Math.ceil(Math.max(0, center.value.y - 150 / scale.value));
    const right = Math.floor(Math.min(imageSize.width, center.value.x + 150 / scale.value));
    const bottom = Math.floor(Math.min(imageSize.height, center.value.y + 150 / scale.value));

    const essentialRect: Rect = {
      left,
      top,
      width: right - left,
      height: bottom - top,
    }
    onChange(essentialRect);
  };

  const animatedStyles = useAnimatedStyle(() => {
    const imageOffsetX = center.value.x - imageSize.width / 2;
    const imageOffsetY = center.value.y - imageSize.height / 2;
    const translateX = clientSize.width / 2 / scale.value - imageOffsetX;
    const translateY = clientSize.height / 2 / scale.value - imageOffsetY;

    return {
      width: imageSize.width,
      height: imageSize.height,
      transform: [
        { translateX: -imageSize.width / 2 },
        { translateY: -imageSize.height / 2 },
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
      runOnJS(reportToParent)();
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
      runOnJS(reportToParent)();
    })
    .onFinalize(() => {
      "worklet";
    });

  const composed = Gesture.Exclusive(panGesture, pinchGesture);

  return (
    <GestureDetector gesture={composed}>
      <Animated.Image style={animatedStyles} source={{ uri: uri }} />
    </GestureDetector>
  );
}

export function SelectEssentialRectScreen({ route, navigation }) {
  const { upload } = useContext(ImagesContext);
  const { user } = useContext(AuthenticationContext);

  const { uri, imageSize } = route.params;

  const [size, setSize] = useState<Size>();
  const essentialRectRef = useRef<Rect>();

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
  };

  const onChange = (e) => {
    essentialRectRef.current = e;
  };

  const onCancel = () => {
    navigation.goBack();
  }

  const onDone = () => {
    // kick off upload!
    upload({
      uid: user?.id,
      localUri: uri,
      essentialRect: essentialRectRef.current, 
      imageSize
    });

    navigation.navigate({
      name: 'Post',
    });
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      {size && (
        <MovableImage
          uri={uri}
          clientSize={size}
          imageSize={imageSize}
          initialScale={600 / imageSize.width}
          onChange={onChange}
        />
      )}

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

      <View style={styles.controlsContainer} pointerEvents="box-none">
        <View style={styles.controlsTop} pointerEvents="none" />
        <View style={styles.controlsBottom} pointerEvents="box-none">
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.controlsText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDone}>
            <Text style={styles.controlsText}>Done</Text>
          </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: 'white',
    width: 300,
    height: 300,
  },

  controlsContainer: {
    flex: 1,
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  controlsTop: {
    flexGrow: 1,
    backgroundColor: "transparent",
  },
  controlsBottom: {
    flexGrow: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
  },
  controlsText: {
    color: "white",
    fontSize: 20,
    padding: 16,
    paddingBottom: 32,
  },
});
