import React, { useContext, useState, useEffect, useCallback, useRef } from "react";
import { Dimensions } from "react-native";
import { FlatList, View, StyleSheet } from "react-native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";

/****** MemoedImageItem ******/

const ImageItem = ({ item, screenDimensions }) => {
  console.log(`ImageItem render...width ${screenDimensions.width}`);
  const containerStyle = { width: screenDimensions.width, height: screenDimensions.height };
  return (
    <View style={containerStyle}>
      <EssentialRectImage
        src={item.full}
        essentialRect={item.essentialRect}
      />
    </View>
  );
}

const imageItemPropsAreEqual = (prev, next) => (
  prev.item.full === next.item.full &&
  prev.screenDimensions.width === next.screenDimensions.width &&
  prev.screenDimensions.height === next.screenDimensions.height
);

const MemoedImageItem = React.memo(ImageItem, imageItemPropsAreEqual)

/************/

export const ImageCarouselScreen = ({ navigation }) => {
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get("screen"));
  const [imageIndex, setImageIndex] = useState(0);
  const { recentImages } = useContext(ImagesContext);
  const ref = useRef<FlatList>();

  const { height: itemSize } = screenDimensions;

  const onViewableItemsChanged = useCallback( ({viewableItems}) => {
    if (viewableItems.length === 1) {
      setImageIndex(viewableItems[0].index);
    }
  }, []);

  const getItemLayout = useCallback( (_, index) => ({
    length: itemSize,
    offset: itemSize * index,
    index,
  }), [itemSize]);

  useEffect( () => {
    const screenChangedHandler = ({screen}) => {
      // we're getting a new object, so to prevent excessive rerenders, to deep check for equality
      setScreenDimensions( prevScreen => (prevScreen.width === screen.width && prevScreen.height === screen.height) ? prevScreen : screen );
    }

    const sub = Dimensions.addEventListener("change", screenChangedHandler);
    return () => Dimensions.removeEventListener("change", screenChangedHandler);
  }, [])

  useEffect( () => {
    if (imageIndex) {
      ref.current?.scrollToIndex({ animated: false, index: imageIndex });
    }
  }, [screenDimensions])

  return (
    <View style={styles.carousel}>
      <FlatList
        ref={ref}
        data={recentImages}
        renderItem={ ({item}) => <MemoedImageItem item={item} screenDimensions={screenDimensions} /> }
        onViewableItemsChanged={onViewableItemsChanged}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={itemSize}
        getItemLayout={getItemLayout}
        keyExtractor={(item) => item.id}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
  },
  imageItem: {
    flex: 1,
  },
});
