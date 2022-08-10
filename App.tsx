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
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context"

SplashScreen.preventAutoHideAsync();

export default function App(): JSX.Element | null {
  let [fontsLoaded] = useInter({ Inter_900Black });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.rootView} onLayout={onLayoutRootView}>
      <ThemeProvider theme={theme}>
        <AuthenticationContextProvider>
          <ImagesContextProvider>
            <Navigation />
          </ImagesContextProvider>
        </AuthenticationContextProvider>
      </ThemeProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});
