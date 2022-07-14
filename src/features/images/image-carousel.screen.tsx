import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Dimensions } from "react-native";
import { FlatList, View, StyleSheet } from "react-native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";

/****** MemoedImageItem ******/

const ImageItem = ({ item, screenDimensions }) => {
  // console.log(`ImageItem render...width ${screenDimensions.width}`);
  const containerStyle = {
    width: screenDimensions.width,
    height: screenDimensions.height,
  };
  return (
    <View style={containerStyle}>
      <EssentialRectImage src={item.full} essentialRect={item.essentialRect} />
    </View>
  );
};

const imageItemPropsAreEqual = (prev, next) =>
  prev.item.full === next.item.full &&
  prev.screenDimensions.width === next.screenDimensions.width &&
  prev.screenDimensions.height === next.screenDimensions.height;

const MemoedImageItem = React.memo(ImageItem, imageItemPropsAreEqual);

/************/

const ImageCarouselList = ({ imageList, screenDimensions, initialIndex, onIndexChanged }) => {
  const { height: itemSize } = screenDimensions;

  console.log(`ImageCarouselList initialIndex=${initialIndex} itemSize=${itemSize}`);
  
  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length === 1) {
      console.log("onViewableItemsChanged changed ", viewableItems[0].index);
      onIndexChanged(viewableItems[0].index);
    }
  }, [onIndexChanged]);

  const getItemLayout = useCallback(
    (_, index) => ({
      length: itemSize,
      offset: itemSize * index,
      index,
    }),
    [itemSize]
  );

  return (
      <FlatList
        data={imageList}
        renderItem={({ item }) => (
          <MemoedImageItem item={item} screenDimensions={screenDimensions} />
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={itemSize}
        getItemLayout={getItemLayout}
        keyExtractor={(item) => item.id}
        initialScrollIndex={initialIndex}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={5}
      />
  );
};

type Orientation = 'portrait' | 'landscape';

export const ImageCarouselScreen = ({ navigation }) => {
  const [screenDimensions, setScreenDimensions] = useState(Dimensions.get("screen"));
  // const [imageIndex, setImageIndex] = useState(0);
  const { recentImages } = useContext(ImagesContext);
  const indexRef = useRef<Number>(0);
  // const ref = useRef<FlatList>();

  const orientation = screenDimensions.width > screenDimensions.height ? 'landscape' : 'portrait';
  const { height: itemSize } = screenDimensions;

  console.log("ImageCarouselScreen")

  const onIndexChanged = useCallback((index) => {
    console.log('new image index = ', index)
    indexRef.current = index;
    //setImageIndex(index);
  }, []);

  useEffect(() => {
    const screenChangedHandler = ({ screen }) => {
      // we're getting a new object, so to prevent excessive rerenders, to deep check for equality
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
      console.log('ImageCarouselScreen unloaded')
    }
  }, [])

  // useEffect(() => {
  //   if (imageIndex) {
  //     ref.current?.scrollToIndex({ animated: false, index: imageIndex });
  //   }
  // }, [screenDimensions]);

  return (
    <View style={styles.carousel}>
      <ImageCarouselList imageList={recentImages} screenDimensions={screenDimensions} initialIndex={indexRef.current} onIndexChanged={onIndexChanged} />
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
