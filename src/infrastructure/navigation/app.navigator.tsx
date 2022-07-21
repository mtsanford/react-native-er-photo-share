import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { PicturesNavigator } from "./pictures.navigator";
import { PostScreen } from "../../features/post/post.screen";
import { ProfileScreen } from "../../features/profile/profile.screen";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Pictures: "image",
  Post: "add-circle-outline",
  Profile: "person-outline",
};

// const createScreenOptions = ({ route }) => {
//   const iconName = TAB_ICON[route.name];
//   return {
//     tabBarIcon: ({ size, color }) => (
//       <Ionicons name={iconName} size={size} color={color} />
//     ),
//   };
// };

export const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
    }}
  >
    <Tab.Screen
      options={{
        tabBarLabel: "Pictures",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="image" color={color} size={size} />
        ),
      }}
      name="Pictures"
      component={PicturesNavigator}
    />
    <Tab.Screen
      options={{
        tabBarLabel: "Post",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
      }}
      name="Post"
      component={PostScreen}
    />
    <Tab.Screen
      options={{
        tabBarLabel: "Profile",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" color={color} size={size} />
        ),
      }}
      name="Profile"
      component={ProfileScreen}
    />
  </Tab.Navigator>
);
