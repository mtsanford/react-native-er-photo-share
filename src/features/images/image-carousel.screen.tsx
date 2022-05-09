import React, { useContext, useState } from "react";
import { Dimensions } from "react-native";
import {
  FlatList,
  Image,
  View,
  StyleSheet,
} from "react-native";
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

const ImageItem = ({item}) => {
  return (
    <ImagePreview source={{ uri: item.preview }} />
  );
};

export const ImageCarouselScreen = ({ navigation }) => {
  const { recentImages } = useContext(ImagesContext);
  const [ numColumns, setNumColumns ] = useState(0);

  const onLayout = (event) => {
    var { width, height } = event.nativeEvent.layout;
  };

  return (
      <View onLayout={onLayout} style={styles.carousel}>
        <FlatList
          data={recentImages}
          renderItem={ ({item}) => (
            <View style={styles.container}>
              <EssentialRectImage src={item.full} essentialRect={item.essentialRect} />
            </View>
          )}
          snapToAlignment="start"
          decelerationRate={"fast"}
          snapToInterval={Dimensions.get("window").width}
          horizontal
          keyExtractor={ (item) => item.id }
        />
      </View>
  );
};

const styles = StyleSheet.create({
    carousel: {
        flex: 1,
    },
    container: {
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,      
      // width: '100%',
      // height: '100%',
    },
    imageItem: {
        flex: 1,
    },
});
