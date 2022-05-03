import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { ImagesContextProvider } from './src/services/images/images.context';
import { RecentImagesScreen } from './src/features/images/recent-images.screen';

export default function App() {
  return (
    <ImagesContextProvider>
      <RecentImagesScreen />
    </ImagesContextProvider>
  );
}

{/* <View style={styles.container}>
<Text>Open up App.tsx to start working on your app!</Text>
<StatusBar style="auto" />
</View> */}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
