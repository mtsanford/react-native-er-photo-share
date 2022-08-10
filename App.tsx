// import just for the side effects
import "react-native-gesture-handler";

import { useCallback, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ImagesContextProvider } from "./src/services/images/images.context";
import { Navigation } from "./src/infrastructure/navigation";
import { ThemeProvider } from "styled-components/native";
import * as SplashScreen from "expo-splash-screen";
import { initializeApp } from "firebase/app";

import { useFonts as useInter, Inter_900Black } from "@expo-google-fonts/inter";

import { theme } from "./src/infrastructure/theme";
import { AuthenticationContextProvider } from "./src/services/authentication/authentication.context";

const firebaseConfig = {
  apiKey: "AIzaSyCPwNgAee5ywYuGdRV3okEUA4mONg8qPP0",
  authDomain: "er-react-native.firebaseapp.com",
  projectId: "er-react-native",
  storageBucket: "er-react-native.appspot.com",
  messagingSenderId: "837080953025",
  appId: "1:837080953025:web:af175092042898ad72e440",
  measurementId: "G-F394ZLCVT0"
};

initializeApp(firebaseConfig);

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
