import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  FC,
} from "react";
import { Dimensions, ScaledSize, ViewabilityConfig, Animated } from "react-native";
import { FlatList, View, StyleSheet, Text, Image as RNImage, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";
import { Image } from '../../infrastructure/types/image.types';
import { Size } from '../../infrastructure/types/geometry.types';
import { SafeArea } from "../../components/utility/safe-area.component";
import { AppStackParamList } from "../../infrastructure/navigation/params";
import { onChange } from "react-native-reanimated";

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


interface CloseOverlayProps {
  onClose: () => void,
}

const CloseOverlay: FC<CloseOverlayProps> = ( {onClose} ) => {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <SafeArea pointerEvents="box-none">
          <Ionicons name="close-circle-outline" size={30} color="black" style={styles.closeStyle} onPress={onClose}/>
      </SafeArea>
    </View>
  )
}

const DetailsBox = styled.View.attrs(
  () => ({
    pointerEvents: "box-none"
  })
)`
  background-color: rgba(255, 255, 255, 0.7);
  height: 100px;
  padding: 12px;
`

const Title = styled.Text.attrs(
  () => ({
    pointerEvents: "none"
  })
)`
  font-size: 20px;
  color: black
  padding-bottom: 4px;
`

const UserBox = styled(TouchableOpacity).attrs(
  () => ({
    pointerEvents: "auto"
  })
)`
  flex: 1;
  flex-direction: row;
  align-items:center;
`

const UserImage = styled.Image`
  width: 24px;
  height: 24px;
`

const UserName = styled.Text`
  font-size: 24px;
  color: #222;
  padding-left: 4px;
`;

interface DetailsOverlayProps {
  showInfo?: boolean;
  image: Image;
}

const DetailsOverlay: FC<DetailsOverlayProps> = ({ showInfo, image }) => {
  const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = useCallback(
    () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  , []);

  const fadeOut = useCallback(
    () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  , []);

  useEffect(() => {
    if (showInfo)  { fadeIn(); }
    else { fadeOut(); }
  }, [showInfo] )

  const userClickedHandler = useCallback(() => {
    navigation.navigate("UserInfo", { uid: image.userId });
  }, [])

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <SafeArea pointerEvents="box-none">
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.detailsInner,
            {
              // Bind opacity to animated value
              opacity: fadeAnim,
            },
          ]}>

          <DetailsBox>
            <Title>{image.title}</Title>
            <UserBox onPress={userClickedHandler}>
              <UserImage source={{ uri: image.photoURL }} />
              <UserName>{image.userName}</UserName>
            </UserBox>
          </DetailsBox>

        </Animated.View>
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

interface ImageCarouselFlatListProps {
  images: Image[];
  initialIndex: number;
  onIndexChange: (index: number) => void;
  onScrollingChange: ( isScrolling: boolean) => void;
  onTouched: () => void;
}

export const ImageCarouselFlatList: FC<ImageCarouselFlatListProps> = ({ initialIndex, onIndexChange, images, onScrollingChange, onTouched }) => {
  const [screenDimensions, setScreenDimensions] = useState(
    Dimensions.get("screen")
  );
  const scrollingRef = useRef<boolean>(false);
  const flatListRef = useRef<FlatList<Image>>();
  const indexRef = useRef<number>(initialIndex);

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
    onIndexChange(indexRef.current);
  }, []);

  const getItemLayout = (_, index) => {
    return {
      length: itemSize,
      offset: itemSize * index,
      index,
    };
  };

  const changeScrolling = (newValue: boolean) => {
    const oldValue = scrollingRef.current;
    scrollingRef.current = newValue;
    if (newValue !== oldValue) {
      onScrollingChange(newValue);
    }
  }

  const onScrollBeginDrag = () => {
    changeScrolling(true);
  };

  const onScrollEndDrag = () => {
    changeScrolling(false);
  };

  const onMomentumScrollBegin = () => {
    changeScrolling(true);
  };

  const onMomentumScrollEnd = () => {
    changeScrolling(false);
  };

  const onLayout = useCallback(() => {
    flatListRef.current?.scrollToIndex({
      animated: false,
      index: indexRef.current,
    });
  }, []);

  return (
      <FlatList
        data={images}
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
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        windowSize={5}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onTouchStart={onTouched}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onLayout={onLayout}
        ref={flatListRef}
      />
  );
};


/************/

type ImageCarouselScreenProps = StackScreenProps<AppStackParamList, 'Carousel'>;

export const ImageCarouselScreen: FC<ImageCarouselScreenProps> = ({ route, navigation }) => {
  const initialIndex = route.params?.initialIndex;
  const { recentImages } = useContext(ImagesContext);
  const [ currentImage, setCurrentImage ] = useState<Image>(recentImages[initialIndex])
  const [ showInfo, setShowInfo ] = useState(true);

  const onClose = () => {
    navigation.goBack();
  }

  const onIndexChange = (index: number) => {
    setCurrentImage(recentImages[index]);
  }

  const onScrollingChange = (newValue: boolean) => {
    setShowInfo(!newValue);
  }

  const onTouched = () => {
    setShowInfo((oldval) => !oldval);
  }

  return (
    <View style={styles.carousel}>
      <CloseOverlay onClose={onClose} />
      <DetailsOverlay showInfo={showInfo} image={currentImage} />
      <ImageCarouselFlatList images={recentImages} initialIndex={initialIndex} onIndexChange={onIndexChange} onScrollingChange={onScrollingChange} onTouched={onTouched} />
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
  fadingContainer: {

  },
  detailsInner: {
    flex: 1,
    padding: 24,
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
