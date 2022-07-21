import { createStackNavigator } from "@react-navigation/stack";

import { RecentImagesScreen } from "../../features/images/recent-images.screen"
import { ImageCarouselScreen } from "../../features/images/image-carousel.screen";

const RootStack = createStackNavigator();

export const PicturesNavigator = () => {
  return (
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
          component={ImageCarouselScreen}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
