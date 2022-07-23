import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { RecentImagesScreen } from "../../features/images/recent-images.screen"
import { PostScreen } from "../../features/post/post.screen";
import { SelectEssentialRectScreen } from "../../features/post/SelectEssentialRect.screen";
import { ProfileScreen } from "../../features/profile/profile.screen";

const Tab = createBottomTabNavigator();

export const HomeNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
    }}
  >
    <Tab.Screen
      options={{
        headerShown: false,
        tabBarLabel: "Pictures",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="image" color={color} size={size} />
        ),
      }}
      name="Pictures"
      component={RecentImagesScreen}
    />
    <Tab.Screen
      options={{
        tabBarLabel: "Post",
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
      }}
      name="Post"
      component={SelectEssentialRectScreen}
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
