import React, { useContext } from "react";
import { FlatList, TouchableOpacity, Image, View } from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../components/utility/safe-area.component";

import { ImagesContext } from "../../services/images/images.context";

const ImageList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

const ImagePreviewWrapper = styled(View)`
  padding: 3px;
  flex: 1;
  aspect-ratio: 1;
`;

const ImagePreview = styled(Image)`
  width: 100%;
  height: 100%;
`;

const ImageItem = (props) => {
  const { item, navigation } = props;
  console.log("ImageItem", item);
  return (
    <ImagePreviewWrapper>
      <TouchableOpacity onPress={() => navigation.navigate("Details", {})}>
        <ImagePreview source={{ uri: item.preview }} />
      </TouchableOpacity>
    </ImagePreviewWrapper>
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
