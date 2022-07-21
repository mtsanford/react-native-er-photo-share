import "react-native-gesture-handler";
import { StyleSheet, Text, View } from "react-native";

import { ImagesContextProvider } from "./src/services/images/images.context";
import { Navigation } from "./src/infrastructure/navigation";

function DetailsScreen() {
  return (
    <View>
      <Text>Details</Text>
    </View>
  );
}

export default function App() {
  return (
    <ImagesContextProvider>
      <Navigation />
    </ImagesContextProvider>
  );
}
