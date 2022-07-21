import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Dimensions, ViewabilityConfig } from "react-native";
import { FlatList, View, StyleSheet, Text } from "react-native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";

/****** MemoedImageItem ******/

const ImageItem = ({ item, screenDimensions }) => {
  const containerStyle = {
    width: "100%",
    height: screenDimensions.height,
  };

  return (
    <View style={containerStyle}>
      <EssentialRectImage
        src={item.full}
        essentialRect={item.essentialRect}
        imageSize={item.size}
        clientSize={screenDimensions}
      />
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
  minimumViewTime: 0,
  itemVisiblePercentThreshold: 90,
};

export const ImageFlatList = ({
  data,
  initialIndex,
  onIndexChanged,
  screenDimensions,
}) => {
  const scrollingRef = useRef<boolean>(false);
  const flatListRef = useRef<FlatList>();
  const indexRef = useRef<number>(initialIndex);
  const itemSize = screenDimensions.height;

  const currentSizeRef = useRef<number>(screenDimensions.height);
  const newSizeRef = useRef<number>(screenDimensions.height);

  // If we're rerendering based on orientation change, ignore all
  // renderItems until onLayout
  if (currentSizeRef.current !== itemSize) {
    newSizeRef.current = itemSize;
  }

  console.log(`ImageFlatList ${itemSize} initialIndex ${initialIndex}`);

  useEffect(() => {
    return () => {
      console.log(`ImageFlatList ${screenDimensions.height} unloaded`);
    };
  }, []);

  // Keep track of which image item is "current", so that we can scroll to it
  // on orientation change.
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    const items = JSON.stringify(viewableItems.map((item) => item.index));

    if (viewableItems.length !== 1) {
      console.log(
        `onViewableItemsChanged ${items} rejected because not exactly 1 viewable item`
      );
      return;
    }

    // reject the item change if it's in repsonse to an orientation change
    if (!scrollingRef.current) {
      console.log(
        `onViewableItemsChanged ${items} rejected because not during scroll`
      );
      return;
    }
    const index = viewableItems[0].index;
    console.log("onViewableItemsChanged new image index = ", index);
    onIndexChanged(index);
    indexRef.current = index;
  }, []);

  const getItemLayout = (_, index) => {
    // console.log(`getItemLayout index=${index} size=${itemSize}`);
    return {
      length: itemSize,
      offset: itemSize * index,
      index,
    };
  };

  const onScrollBeginDrag = () => {
    console.log("onScrollBeginDrag");
    scrollingRef.current = true;
  };

  const onScrollEndDrag = () => {
    console.log("onScrollEndDrag");
    scrollingRef.current = false;
  };

  const onMomentumScrollBegin = () => {
    console.log("onMomentumScrollBegin");
    scrollingRef.current = true;
  };

  const onMomentumScrollEnd = () => {
    console.log("onMomentumScrollEnd");
    scrollingRef.current = false;
  };

  const scrollToIndex = useCallback(() => {
    console.log("scrollToIndex scrollToIndex ", indexRef.current);
    flatListRef.current?.scrollToIndex({
      animated: false,
      index: indexRef.current,
    });
  }, []);

  const onLayout = useCallback(() => {
    console.log(`onLayout index=${indexRef.current}`);
    currentSizeRef.current = newSizeRef.current;
    flatListRef.current?.scrollToIndex({
      animated: false,
      index: indexRef.current,
    });
  }, []);

  const onContentSizeChange = useCallback((w, h) => {
    console.log(`onContentSizeChange ${w} ${h} index=${indexRef.current}`);
  }, []);

  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => {
        console.log(`renderItem ${index} size=${itemSize}`);
        return (
          <MemoedImageItem item={item} screenDimensions={screenDimensions} />
        );
      }}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      snapToAlignment="start"
      decelerationRate={"fast"}
      snapToInterval={itemSize}
      getItemLayout={getItemLayout}
      keyExtractor={(item) => item.id}
      initialScrollIndex={indexRef.current}
      initialNumToRender={1}
      maxToRenderPerBatch={2}
      windowSize={5}
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
      onMomentumScrollBegin={onMomentumScrollBegin}
      onMomentumScrollEnd={onMomentumScrollEnd}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      ref={flatListRef}
    />
  );
};

export const ImageCarouselSingleFlatListScreen = ({ route }) => {
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("screen")
  );
  const { recentImages } = useContext(ImagesContext);
  const indexRef = useRef<number>(0);

  const { height: itemSize } = screenDimensions;
  const initialIndex = route.params?.initialIndex;

  console.log(`ImageCarouselScreen itemSize=${itemSize} ${initialIndex}`);

  const onIndexChanged = useCallback((index) => {
    indexRef.current = index;
  }, []);

  useEffect(() => {
    const screenChangedHandler = ({ screen }) => {
      // we're getting a new object, and we may get multiple events for one orientation change
      // so to prevent excessive rerenders, to deep check for equality
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

  return (
    <View style={styles.carousel}>
      <ImageFlatList
        data={recentImages}
        initialIndex={initialIndex}
        onIndexChanged={onIndexChanged}
        screenDimensions={screenDimensions}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    backgroundColor: "black",
  },
  imageItem: {
    flex: 1,
    backgroundColor: "black",
  },
});
