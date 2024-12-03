import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/HomeScreen';
import WorkoutStackNavigator from './WorkoutStackNavigator';
import ProgressScreen from '../components/progress/ProgressScreen';
import { NavigatorScreenParams } from '@react-navigation/native';
import { WorkoutStackParamList } from './WorkoutStackNavigator';
import { Ionicons } from '@expo/vector-icons'; // Install with: expo install @expo/vector-icons

export type MainTabParamList = {
    Home: undefined;
    Workouts: NavigatorScreenParams<WorkoutStackParamList>;
    Progress: undefined;
  };
  
  const Tab = createBottomTabNavigator<MainTabParamList>();
  
  export default function MainTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap; // Ensures valid icon names
  
            if (route.name === 'Home') {
              iconName = 'home'; // Icon for Home tab
            } else if (route.name === 'Workouts') {
              iconName = 'barbell'; // Icon for Workouts tab
            } else if (route.name === 'Progress') {
              iconName = 'stats-chart'; // Icon for Progress tab
            } else {
              iconName = 'help-circle'; // Fallback icon
            }
  
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#134074',
          tabBarInactiveTintColor: '#8da9c4',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Workouts" component={WorkoutStackNavigator} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
      </Tab.Navigator>
    );
  }