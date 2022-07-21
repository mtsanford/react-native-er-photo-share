import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageStyle,
  LayoutChangeEvent,
} from "react-native";
import { Rect, Size } from "../infrastructure/types/geometry.types";
import { fitRect, sizeToRect } from "../infrastructure/fit-essential-rect";

interface EssentialRectImageProps {
  src: string;
  essentialRect: Rect;
  imageSize: Size;

  // If a client size is not privided, the image will not be shown until the onLayout event
  clientSize?: Size;
}

export const EssentialRectImage = (props: EssentialRectImageProps) => {
  const { src, essentialRect, imageSize, clientSize: initialClientSize } = props;
  const [clientSize, setClientSize] = useState<Size | undefined>(initialClientSize);

  const clientRect = clientSize ? sizeToRect(clientSize) : undefined;
  const imageRect = sizeToRect(imageSize);

  let imageStyles: ImageStyle = {};

  if (clientRect) {
    const imageClientRect = fitRect(imageRect, essentialRect, clientRect);
    imageStyles = {
      top: imageClientRect.top,
      left: imageClientRect.left,
      width: Math.floor(imageClientRect.width),
      height: Math.floor(imageClientRect.height),
      position: "absolute",
    };
  }

  const onLayout = (event: LayoutChangeEvent) => {
    var { width, height } = event.nativeEvent.layout;
    setClientSize((prevSize) =>
      prevSize && prevSize.height === height && prevSize.width === width
        ? prevSize
        : { width, height }
    );
  };

  return (
    <View style={ERstyles.container} onLayout={onLayout}>
      {clientRect && (
        <Image
          source={{ uri: src }}
          resizeMode="stretch"
          style={imageStyles}
        />
      )}
    </View>
  );
};

const ERstyles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    backgroundColor: "white",
    position: "relative",
  },
});
