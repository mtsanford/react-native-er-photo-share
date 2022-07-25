import React, { useState, useEffect } from "react";
import { LayoutChangeEvent, StyleSheet, View, Image } from "react-native";

import { Size } from "../../infrastructure/types/geometry.types";

const imageUri =
  "https://firebasestorage.googleapis.com/v0/b/er-react-native.appspot.com/o/images2%2Fpic01_full.jpg?alt=media&token=509e811d-4dba-4687-8994-4549279cdf7b";

const imageSize = { width: 1681, height: 1600 };
const scale = 0.3;
// const center = { x: imageSize.width, y: imageSize.height};
// const center = { x: 0, y: 0};
const center = { x: imageSize.width / 2, y: imageSize.height / 2};

export const TestTransform = () => {
  const [clientSize, setClientSize] = useState<Size>();

  const onLayout = (e: LayoutChangeEvent) => {
    setClientSize({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height});
  }

  let imageStyles = {};

  if (clientSize) {

    const baseTranlationX = clientSize.width / 2 - imageSize.width / 2;
    const baseTranlationY = clientSize.height / 2 - imageSize.height / 2;
  
    const imageOffsetX = center.x - imageSize.width / 2;
    const imageOffsetY = center.y - imageSize.height / 2;
    // const imageOffsetX = 0;
    // const imageOffsetY = 0;
    const translateX = (clientSize.width / 2) / scale - imageOffsetX;
    const translateY = (clientSize.height / 2) / scale - imageOffsetY;

    console.log('imageOffsetX', imageOffsetX);
    console.log('translateX', translateX);

    imageStyles = {
      width: imageSize.width,
      height: imageSize.height,
      transform: [
        { translateX: - imageSize.width / 2 },
        { translateY: - imageSize.height / 2 },
        { scale: scale },
        { translateX: translateX },
        { translateY: translateY },
      ],
    };

  }

  console.log("TestTransform");
  return (
    <View style={styles.container} onLayout={onLayout}>
      {clientSize && <Image source={{ uri: imageUri }} style={imageStyles} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    transform: [{ scale: 3 }, { translateX: 25 }, { translateY: 25 }],
  },
});
