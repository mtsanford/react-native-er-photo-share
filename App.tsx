// import just for the side effects
import "react-native-gesture-handler";

import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ImagesContextProvider } from "./src/services/images/images.context";
import { Navigation } from "./src/infrastructure/navigation";
import { ThemeProvider } from "styled-components/native";
import * as SplashScreen from "expo-splash-screen";

import { useFonts as useInter, Inter_900Black } from "@expo-google-fonts/inter";

import { theme } from "./src/infrastructure/theme";

// SplashScreen.preventAutoHideAsync();

export default function App(): JSX.Element | null {
  let [fontsLoaded] = useInter({ Inter_900Black });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      console.log('font loaded');
      // await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <ThemeProvider theme={theme}>
      <ImagesContextProvider>
        <Navigation />
      </ImagesContextProvider>
    </ThemeProvider>
  );
}

{
  /* <View style={styles.rootView} onLayout={onLayoutRootView}> */
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
