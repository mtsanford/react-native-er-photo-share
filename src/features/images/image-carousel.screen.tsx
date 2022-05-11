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

const initialScreenDimensions = Dimensions.get("screen");

const InitialImageItem = ({item}) => {
  return <ImageItem item={item} screenDimensions={initialScreenDimensions} />
}

let renderImageItem = React.memo(InitialImageItem);
console.log('renderImageItem', renderImageItem);
console.log('InitialImageItem', InitialImageItem);

export const ImageCarouselScreen = ({ navigation }) => {
  const [screenDimensions, setScreenDimensions] = useState(initialScreenDimensions);
  const [imageIndex, setImageIndex] = useState(0);
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
    setScreenDimensions( prevScreen => (prevScreen.width === screen.width && prevScreen.height === screen.height) ? prevScreen : screen );
    renderImageItem = React.memo( ({item}) => (<ImageItem item={item} screenDimensions={screen} />) );
    console.log('new screen', screen);
  }, []);

  useEffect( () => {
    console.log('screenChangedHandler changed')

    const screenChangedHandler = ({screen}) => {
      setScreenDimensions( prevScreen => (prevScreen.width === screen.width && prevScreen.height === screen.height) ? prevScreen : screen );
      renderImageItem = React.memo( ({item}) => <ImageItem item={item} screenDimensions={screen} /> );
      console.log('new screen', screen);
    }

    const sub = Dimensions.addEventListener("change", screenChangedHandler);
    return () => Dimensions.removeEventListener("change", screenChangedHandler);
  }, [])

  const getItemLayout = useCallback( (_, index) => ({
    length: screenDimensions.width,
    offset: screenDimensions.width * index,
    index,
  }), [screenDimensions]);

  const renderItemOld = useCallback( ({item}) => {
    const containerStyle = { width: screenDimensions.width, height: screenDimensions.height };
    return <ImageItem item={item} containerStyle={containerStyle} />
  }, [screenDimensions]);

  // const renderItem = React.memo( ({item, width, height}) => {
  //   return <ImageItem item={item} containerStyle={{width, height}} />
  // })

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
        renderItem={renderImageItem}
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
