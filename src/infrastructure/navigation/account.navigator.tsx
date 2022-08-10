import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { LoginScreen } from "../../features/profile/login.screen";
import { ProfileScreen } from "../../features/profile/profile.screen";

const StackNavigator = createStackNavigator();

export const AccountNavigator = ({ navigation }) => {
  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <StackNavigator.Navigator>
      {isAuthenticated ? (
        <StackNavigator.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
      ) : (
        <StackNavigator.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
      )}
    </StackNavigator.Navigator>
  );
};
