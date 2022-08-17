import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { ProfileScreen } from "../../features/profile/profile.screen";

const StackNavigator = createStackNavigator();

export const ProfileNavigator = ({ navigation }) => {
  return (
    <StackNavigator.Navigator>
        <StackNavigator.Screen name="ProfileSummary" options={{ headerShown: false }} component={ProfileScreen} />
    </StackNavigator.Navigator>
  );
};
