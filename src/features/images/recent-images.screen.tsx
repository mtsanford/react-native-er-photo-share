import React, { useContext } from "react";
import { FlatList, TouchableOpacity, Image, View, StyleSheet } from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../components/utility/safe-area.component";

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

const ImageItem = (props) => {
  const { item, navigation } = props;
  return (
    <View style={styles.imagePreviewWrapper}>
      <TouchableOpacity onPress={() => navigation.navigate("Details", {item})}>
        <ImagePreview source={{ uri: item.preview }} />
      </TouchableOpacity>
    </View>
  );
};

export const RecentImagesScreen = ({ navigation }) => {
  const { recentImages } = useContext(ImagesContext);
  return (
    <SafeArea>
      <ImageList
        data={recentImages}
        numColumns={2}
        renderItem={({ item }) => (
          <ImageItem item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.id}
      ></ImageList>
    </SafeArea>
  );
};


const styles = StyleSheet.create({
  imagePreviewWrapper: {
    padding: 2,
    flex: 1 / 2,
    aspectRatio: 1,
  },
})