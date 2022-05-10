import React, { useContext, useState, useEffect, useCallback, useRef, memo } from "react";
import { useWindowDimensions, Dimensions } from "react-native";
import { FlatList, Image, View, StyleSheet } from "react-native";
import styled from "styled-components/native";

import { EssentialRectImage } from "../../components/EssentialRectImage";
import { ImagesContext } from "../../services/images/images.context";

const ImageList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 4,
  },
})``;

const ImagePreview = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ImageItem = ({ item, containerStyle }) => {
  console.log(`ImageItem render...width ${containerStyle.width}`);
  return (
    <View style={containerStyle}>
      <EssentialRectImage
        src={item.full}
        essentialRect={item.essentialRect}
      />
    </View>
  );
}

const initialScreenDimensions = Dimensions.get("screen");

export const ImageCarouselScreen = ({ navigation }) => {
  const [screenDimensions, setScreenDimensions] = useState(initialScreenDimensions);
  const [imageIndex, setImageIndex] = useState(0);
  // const { width, height } = useWindowDimensions();
  const { recentImages } = useContext(ImagesContext);
  const ref = useRef<FlatList>();

  const { width, height } = screenDimensions;

  console.log('ImageCarouselScreen render');

  const onViewableItemsChanged = useCallback( ({viewableItems}) => {
    if (viewableItems.length === 1) {
      setImageIndex(viewableItems[0].index);
      console.log('new index', viewableItems[0].index);
    }
  }, []);

  const screenChangedHandler = useCallback( ({screen}) => {
    setScreenDimensions(screen);
    console.log('new screen', screen);
  }, []);

  useEffect( () => {
    console.log('screenChangedHandler changed')
    const sub = Dimensions.addEventListener("change", screenChangedHandler);
    return () => Dimensions.removeEventListener("change", screenChangedHandler);
  }, [screenChangedHandler])

  const getItemLayout = useCallback( (_, index) => ({
    length: screenDimensions.width,
    offset: screenDimensions.width * index,
    index,
  }), [screenDimensions]);

  const renderItem = useCallback( ({item}) => {
    const containerStyle = { width: screenDimensions.width, height: screenDimensions.height };
    return <ImageItem item={item} containerStyle={containerStyle} />
  }, [screenDimensions]);

  useEffect( () => {
    if (imageIndex) {
      console.log(`scrolling to ${imageIndex}`);
      ref.current?.scrollToIndex({ animated: false, index: imageIndex });
    }
  }, [screenDimensions])

  return (
    <View style={styles.carousel}>
      <FlatList
        ref={ref}
        data={recentImages}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        snapToAlignment="start"
        decelerationRate={"fast"}
        snapToInterval={width}
        getItemLayout={getItemLayout}
        horizontal
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

// renderItem={({ item }) => (
//   <View style={containerStyle}>
//     <EssentialRectImage
//       src={item.full}
//       essentialRect={item.essentialRect}
//     />
//   </View>
// )}


const styles = StyleSheet.create({
  carousel: {
    flex: 1,
  },
  container: {
    // height: Dimensions.get("window").height,
    // width: Dimensions.get("window").width,
    // width: '100%',
    // height: '100%',
  },
  imageItem: {
    flex: 1,
  },
});
