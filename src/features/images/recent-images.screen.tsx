import React, { useContext, useState } from "react";
import {
  FlatList,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../components/utility/safe-area.component";

import { ImagesContext } from "../../services/images/images.context";

const ImageList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 4,
  },
})``;

const ImageList2Col = ({ images, navigation }) => (
  <ImageList
    data={images}
    numColumns={2}
    renderItem={({ item }) => (
      <ImageItem
        item={item}
        navigation={navigation}
        style={styles.imagePreviewWrapper_2_column}
      />
    )}
    keyExtractor={(item) => item.id + '_2'}
  />
);

const ImageList3Col = ({ images, navigation }) => (
  <ImageList
    data={images}
    numColumns={3}
    renderItem={({ item }) => (
      <ImageItem
        item={item}
        navigation={navigation}
        style={styles.imagePreviewWrapper_3_column}
      />
    )}
    keyExtractor={(item) => item.id + '_3'}
  />
);

const ImageList4Col = ({ images, navigation }) => (
  <ImageList
    data={images}
    numColumns={4}
    renderItem={({ item }) => (
      <ImageItem
        item={item}
        navigation={navigation}
        style={styles.imagePreviewWrapper_4_column}
      />
    )}
    keyExtractor={(item) => item.id + '_4'}
  />
);

const ImageList5Col = ({ images, navigation }) => (
  <ImageList
    data={images}
    numColumns={5}
    renderItem={({ item }) => (
      <ImageItem
        item={item}
        navigation={navigation}
        style={styles.imagePreviewWrapper_5_column}
      />
    )}
    keyExtractor={(item) => item.id + '_5'}
  />
);

const ImagePreview = styled(Image)`
  width: 100%;
  height: 100%;
`;

const calcColumns = (width: number, height: number) => {
  const aspectRatio = width / height;
  // console.log(aspectRatio);
  if (aspectRatio > 1.9) return 5;
  if (aspectRatio > 1.4) return 4;
  if (aspectRatio > 0.9) return 3;
  return 2;
};

const ImageItem = (props) => {
  const { item, navigation, style } = props;
  return (
    <View style={style}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Carousel")}
      >
        <ImagePreview source={{ uri: item.preview }} />
      </TouchableOpacity>
    </View>
  );
};

export const RecentImagesScreen = ({ navigation }) => {
  const { recentImages } = useContext(ImagesContext);
  const [ numColumns, setNumColumns ] = useState(0);

  const onLayout = (event) => {
    var { width, height } = event.nativeEvent.layout;
    setNumColumns(calcColumns(width, height));
  };

  return (
    <SafeArea>
      <View onLayout={onLayout}>
        {(numColumns == 2) && <ImageList2Col images={recentImages} navigation={navigation} />}
        {(numColumns == 3) && <ImageList3Col images={recentImages} navigation={navigation} />}
        {(numColumns == 4) && <ImageList4Col images={recentImages} navigation={navigation} />}
        {(numColumns == 5) && <ImageList5Col images={recentImages} navigation={navigation} />}
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  imagePreviewWrapper_2_column: {
    padding: 2,
    flex: 1 / 2,
    aspectRatio: 1,
  },
  imagePreviewWrapper_3_column: {
    padding: 2,
    flex: 1 / 3,
    aspectRatio: 1,
  },
  imagePreviewWrapper_4_column: {
    padding: 2,
    flex: 1 / 4,
    aspectRatio: 1,
  },
  imagePreviewWrapper_5_column: {
    padding: 2,
    flex: 1 / 5,
    aspectRatio: 1,
  },
});
