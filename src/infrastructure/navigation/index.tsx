import React, { useContext } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { AppNavigator } from "./app.navigator";

export const Navigation = () => {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "white",
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};
