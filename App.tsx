import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { ImagesContextProvider } from "./src/services/images/images.context";
import { RecentImagesScreen } from "./src/features/images/recent-images.screen";
import { ImageViewScreen } from "./src/features/images/image-view.screen";
import { ImageCarouselScreen } from "./src/features/images/image-carousel.screen";
import { ImageCarouselSingleFlatListScreen } from "./src/features/images/image-carousel-single-flatlist.screen";
import 'react-native-gesture-handler';

const RootStack = createStackNavigator();

function DetailsScreen() {
  return (
    <View>
      <Text>Details</Text>
    </View>
  );
}

export default function App() {

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
    },
  };

  return (
    <ImagesContextProvider>
      <NavigationContainer theme={navTheme}>
        <RootStack.Navigator>
          <RootStack.Group>
            <RootStack.Screen
              name="Home"
              component={RecentImagesScreen}
              options={{
                headerShown: false,
              }}
            />
            <RootStack.Screen
              name="Carousel"
              component={ImageCarouselSingleFlatListScreen}
              options={{
                headerShown: false,
              }}
            />
          </RootStack.Group>
        </RootStack.Navigator>
      </NavigationContainer>
    </ImagesContextProvider>
  );
}

