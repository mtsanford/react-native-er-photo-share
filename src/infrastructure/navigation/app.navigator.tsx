import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { HomeNavigator } from "./home.navigator";
import { ImageCarouselScreen } from "../../features/images/image-carousel.screen";
import { SelectEssentialRectScreen } from "../../features/post/SelectEssentialRect.screen";
import { UserScreen } from "../../features/user/user.screen"
import { AppStackParamList } from "./params";


const RootStack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <RootStack.Navigator>
      <RootStack.Group>
        <RootStack.Screen
          name="Home"
          component={HomeNavigator}
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
        <RootStack.Screen
          name="ERSelect"
          component={SelectEssentialRectScreen}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name="UserInfo"
          component={UserScreen}
          options={{
            headerShown: false,
          }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  );
};
