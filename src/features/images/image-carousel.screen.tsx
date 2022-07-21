import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Dimensions, ScaledSize, ViewabilityConfig } from "react-native";
import { FlatList, View, StyleSheet, Text } from "react-native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";
import { Image } from '../../infrastructure/types/image.types';
import { Size } from '../../infrastructure/types/geometry.types';

/****** MemoedImageItem ******/

interface ImageItemProps {
  item: Image;
  screenDimensions: Size;
}

const ImageItem = ({ item, screenDimensions }: ImageItemProps) => {
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

const imageItemPropsAreEqual = (prev: ImageItemProps, next: ImageItemProps) =>
  prev.item.full === next.item.full &&
  prev.screenDimensions.width === next.screenDimensions.width &&
  prev.screenDimensions.height === next.screenDimensions.height;

const MemoedImageItem = React.memo(ImageItem, imageItemPropsAreEqual);

/************/

const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 0,
  itemVisiblePercentThreshold: 90,
};

export const ImageCarouselScreen = ({ route }) => {
  const initialIndex = route.params?.initialIndex;
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("screen")
  );
  const scrollingRef = useRef<boolean>(false);
  const flatListRef = useRef<FlatList<Image>>();
  const indexRef = useRef<number>(initialIndex);
  const { recentImages } = useContext(ImagesContext);

  const itemSize = screenDimensions.height;

  useEffect(() => {
    const screenChangedHandler = ({ screen }: { screen: ScaledSize }) => {
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

  // Keep track of which image item is "current", so that we can scroll to it
  // on orientation change.
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length !== 1) {
      // rejected because not exactly 1 viewable item
      return;
    }

    if (!scrollingRef.current) {
      // reject the item change if it's in repsonse to an orientation change
      return;
    }

    const index = viewableItems[0].index;
    indexRef.current = index;
  }, []);

  const getItemLayout = (_, index) => {
    return {
      length: itemSize,
      offset: itemSize * index,
      index,
    };
  };

  const onScrollBeginDrag = () => {
    scrollingRef.current = true;
  };

  const onScrollEndDrag = () => {
    scrollingRef.current = false;
  };

  const onMomentumScrollBegin = () => {
    scrollingRef.current = true;
  };

  const onMomentumScrollEnd = () => {
    scrollingRef.current = false;
  };

  const onLayout = useCallback(() => {
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
        initialScrollIndex={indexRef.current}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={5}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onLayout={onLayout}
        ref={flatListRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    flex: 1,
    backgroundColor: "white",
  },
  imageItem: {
    flex: 1,
    backgroundColor: "white",
  },
});
