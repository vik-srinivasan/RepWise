import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/HomeScreen';
import WorkoutStackNavigator from './WorkoutStackNavigator';
import ProgressScreen from '../components/progress/ProgressScreen';
import AIWorkoutScreen from '../components/workouts/AIWorkoutScreen'; // Import your new screen
import { NavigatorScreenParams } from '@react-navigation/native';
import { WorkoutStackParamList } from './WorkoutStackNavigator';
import { Ionicons } from '@expo/vector-icons'; // Install with: expo install @expo/vector-icons
import colors from '@/styles/colors';

export type MainTabParamList = {
  Home: undefined;
  Workouts: NavigatorScreenParams<WorkoutStackParamList>;
  Progress: undefined;
  Generate: { triggerGenerate?: boolean }; // Add the new route here
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          // Assign icons based on route name
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Workouts') {
            iconName = 'barbell';
          } else if (route.name === 'Progress') {
            iconName = 'stats-chart';
          } else if (route.name === 'Generate') {
            iconName = 'sparkles';
          } else {
            iconName = 'help-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          height: 50, // Adjust height as needed
          backgroundColor: '#ffffff',
          paddingBottom: 0, // Remove extra padding
          borderTopWidth: 0, // Remove border
        },
        tabBarActiveTintColor: colors.darkNavy,
        tabBarInactiveTintColor: colors.lightBlue,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutStackNavigator} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="Generate" component={AIWorkoutScreen} />
    </Tab.Navigator>
  );
}
