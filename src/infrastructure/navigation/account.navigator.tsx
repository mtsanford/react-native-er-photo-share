import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { LoginScreen } from "../../features/account/login.screen";
import { RegisterScreen } from "../../features/account/register.screen";

const StackNavigator = createStackNavigator();

export const AccountNavigator = () => {

  return (
    <StackNavigator.Navigator>
        <StackNavigator.Screen name="Register" options={{ headerShown: false }} component={RegisterScreen} />
        <StackNavigator.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
    </StackNavigator.Navigator>
  );
};
