import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Dimensions, ViewabilityConfig } from "react-native";
import { FlatList, View, StyleSheet } from "react-native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";

/****** MemoedImageItem ******/

const ImageItem = ({ item, screenDimensions }) => {
  console.log(`ImageItem render...${screenDimensions.height} ${item.full}`);
  const containerStyle = {
    width: screenDimensions.width,
    height: screenDimensions.height,
  };
  return (
    <View style={containerStyle}>
      <EssentialRectImage src={item.full} essentialRect={item.essentialRect} imageSize={item.size} />
    </View>
  );
};

const imageItemPropsAreEqual = (prev, next) =>
  prev.item.full === next.item.full &&
  prev.screenDimensions.width === next.screenDimensions.width &&
  prev.screenDimensions.height === next.screenDimensions.height;

const MemoedImageItem = React.memo(ImageItem, imageItemPropsAreEqual);

/************/

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 50,
  itemVisiblePercentThreshold: 80,
}

export const ImageCarouselSingleFlatListScreen = ({ navigation }) => {
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("screen")
  );
  // const [imageIndex, setImageIndex] = useState(0);
  const { recentImages } = useContext(ImagesContext);
  const indexRef = useRef<number>(0);
  const flatListRef = useRef<FlatList>();

  const { height: itemSize } = screenDimensions;

  console.log(`ImageCarouselScreen itemSize=${itemSize}`);

  const onIndexChanged = useCallback((index) => {
    console.log("new image index = ", index);
    indexRef.current = index;
    //setImageIndex(index);
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length === 1) {
      console.log("onViewableItemsChanged changed ", viewableItems[0].index);
      // onIndexChanged(viewableItems[0].index);
      indexRef.current = viewableItems[0].index;
    }
  }, []);

  useEffect(() => {
    const screenChangedHandler = ({ screen }) => {
      // we're getting a new object, so to prevent excessive rerenders, to deep check for equality
      console.log("screenChangedHandler", screen);
      setScreenDimensions((prevScreen) =>
        prevScreen.width === screen.width && prevScreen.height === screen.height
          ? prevScreen
          : screen
      );
    };

    const sub = Dimensions.addEventListener("change", screenChangedHandler);
    return () => Dimensions.removeEventListener("change", screenChangedHandler);
  }, []);

  useEffect(() => {
    return () => {
      console.log("ImageCarouselScreen unloaded");
    };
  }, []);

  // useEffect(() => {
  //   console.log('scrollToIndex ', indexRef.current);
  //   listRef.current?.scrollToIndex({ animated: false, index: indexRef.current });
  // }, [screenDimensions]);

  const getItemLayout = (_, index) => ({
    length: itemSize,
    offset: itemSize * index,
    index,
  });

  const scrollToIndex = useCallback(() => {
    console.log("scrollToIndex scrollToIndex ", indexRef.current);
    flatListRef.current?.scrollToIndex({
      animated: false,
      index: indexRef.current,
    });
  }, []);

  return (
    <View style={styles.carousel}>
      <FlatList
        data={recentImages}
        renderItem={({ item }) => (
          <MemoedImageItem item={item} screenDimensions={screenDimensions} />
        )}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={itemSize}
        getItemLayout={getItemLayout}
        keyExtractor={(item) => item.id}
        // initialScrollIndex={initialIndex}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={5}
        // onLayout={scrollToIndex}
        onContentSizeChange={scrollToIndex}
        ref={flatListRef}
      />

      {/* { orientation === "landscape" && <View style={styles.red} />}
        { orientation === "portrait" && <View style={styles.green} />} */}
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
  red: {
    flex: 1,
    backgroundColor: "red",
  },
  green: {
    flex: 1,
    backgroundColor: "green",
  },
});
