import React, { useContext } from "react";
import { FlatList, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";

import { SafeArea } from "../../components/utility/safe-area.component";

import { ImagesContext } from "../../services/images/images.context";

const ImageList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

const ImagePreview = styled(Image)`
  width: 150px;
  height: 150px;
`;

export const RecentImagesScreen = () => {
  const { recentImages } = useContext(ImagesContext);
  return (
    <SafeArea>
      <ImageList
        data={recentImages}
        renderItem={({ item }) => {
          return <ImagePreview source={{ uri: item.preview }} />;
        }}
      ></ImageList>
    </SafeArea>
  );
};
