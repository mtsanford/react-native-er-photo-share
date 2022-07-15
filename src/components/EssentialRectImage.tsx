import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Image, ImageSourcePropType, ViewStyle, ImageStyle } from "react-native";
import { Rect, Size } from "../infrastructure/types/geometry.types";
import { fitRect } from "../infrastructure/fit-essential-rect";


interface EssentialRectImageProps {
  src: string;
  essentialRect: Rect;
  imageSize: Size;
}

export const EssentialRectImage = (props: EssentialRectImageProps) => {
  const { src, essentialRect, imageSize } = props;
  const [clientRect, setClientRect] = useState<Rect | null>(null);
  // const mountedRef = useRef(true);

  const imageRect: Rect = {
    width: imageSize.width,
    height: imageSize.height,
    left: 0,
    top: 0,
  }

  // useEffect(() => {
  //   const start = Date.now();
  //   Image.getSize(src, (width, height) => {
  //     if (mountedRef.current) {
  //       const duration = Date.now() - start;
  //       console.log(`Image.getSize took ${duration}ms for ${src}`);
  //       setImageRect({left: 0, top: 0, width, height});
  //     }
  //   }, (error) => {
  //     console.log(error);
  //   })

  //   return () => { mountedRef.current = false };
  // }, [src])

  let imageStyles: ImageStyle = {};

  if (clientRect && imageRect) {
    const imageClientRect = fitRect(imageRect, essentialRect, clientRect);
    imageStyles = {
      top: imageClientRect.top,
      left: imageClientRect.left,
      width: Math.floor(imageClientRect.width),
      height: Math.floor(imageClientRect.height),
      position: "absolute",
    };
  }

  const onLayout = (event) => {
    var { width, height } = event.nativeEvent.layout;
    setClientRect({
      left: 0,
      top: 0,
      width,
      height,
    });
  };

  return (
    <View style={ERstyles.container} onLayout={onLayout}>
      {clientRect && imageRect && (
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
    backgroundColor: "black",
    position: "relative",
  },
  image: {
    position: "absolute",
    top: 50,
    left: 50,
    width: 300,
    height: 134,
  },
});
