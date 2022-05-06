import React, { FC } from "react";
import { View, StyleSheet } from "react-native";

import { EssentialRectImage } from "../../components/EssentialRectImage";

export const ImageViewScreen = ({ route }) => {
  const item = route.params.item;
  return (
    <View style={styles.container}>
      <EssentialRectImage src={item.full} essentialRect={item.essentialRect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
});


