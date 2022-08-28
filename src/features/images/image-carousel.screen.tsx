import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  FC,
} from "react";
import { Dimensions, ScaledSize, ViewabilityConfig } from "react-native";
import { FlatList, View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";
import { Image } from '../../infrastructure/types/image.types';
import { Size } from '../../infrastructure/types/geometry.types';
import { SafeArea } from "../../components/utility/safe-area.component";

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


const CloseOverlay: FC = () => {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <SafeArea pointerEvents="box-none">
          <Ionicons name="close-circle-outline" size={30} color="black" style={styles.closeStyle} />
      </SafeArea>
    </View>
  )
}

interface DetailsOverlayProps {
  showInfo?: boolean;
}

const Title = styled(Text)`
  font-size: 20px;
  background-color: white;
  color: black;
  padding: 4px;
`;

const DetailsOverlay: FC<DetailsOverlayProps> = ({ showInfo = true }) => {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <SafeArea pointerEvents="box-none">
        <View style={styles.detailsInner} pointerEvents="box-none">
          <Title>This is the title!</Title>
        </View>
      </SafeArea>
    </View>
  )
}

const imageItemPropsAreEqual = (prev: ImageItemProps, next: ImageItemProps) =>
  prev.item.full === next.item.full &&
  prev.screenDimensions.width === next.screenDimensions.width &&
  prev.screenDimensions.height === next.screenDimensions.height;

const MemoedImageItem = React.memo(ImageItem, imageItemPropsAreEqual);


const viewabilityConfig: ViewabilityConfig = {
  minimumViewTime: 0,
  itemVisiblePercentThreshold: 90,
};

export const ImageCarouselFlatList = ({ initialIndex } : { initialIndex : number }) => {
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
  );
};


/************/

export const ImageCarouselScreen = ({ route }) => {
  const initialIndex = route.params?.initialIndex;

  return (
    <View style={styles.carousel}>
      <CloseOverlay />
      <DetailsOverlay showInfo={false} />
      <ImageCarouselFlatList initialIndex={initialIndex} />
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
  overlay: {
    zIndex: 100,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    flex: 1,
  },
  detailsInner: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  closeStyle: {
    zIndex: 200,
    marginLeft: 12,
    marginTop: 8,
    left: 0,
    top: 0,
  }
});
