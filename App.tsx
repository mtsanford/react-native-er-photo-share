import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { ImagesContextProvider } from "./src/services/images/images.context";
import { RecentImagesScreen } from "./src/features/images/recent-images.screen";
import { ImageViewScreen } from './src/features/images/image-view.screen';

const RootStack = createStackNavigator();

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
      <NavigationContainer>
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
              name="Details"
              component={ImageViewScreen}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
