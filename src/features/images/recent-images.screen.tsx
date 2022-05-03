import React, { useContext } from "react";
import { FlatList, TouchableOpacity, Image, View } from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../components/utility/safe-area.component";

import { ImagesContext } from "../../services/images/images.context";

const ImageList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})`
  flex: 1;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
`;

const ImagePreviewWrapper = styled(View)`
  padding: 3px;
  width: 50%;
  height: 100px;
  aspect-ratio: 1;
`;

const ImagePreview = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const RecentImagesScreen = () => {
  const { recentImages } = useContext(ImagesContext);
  return (
    <SafeArea>
      <ImageList
        data={recentImages}
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <ImagePreviewWrapper>
              <ImagePreview source={{ uri: item.preview }} />
            </ImagePreviewWrapper>
          );
        }}
        keyExtractor={ (item) => item.id }
      ></ImageList>
    </SafeArea>
  );
};
