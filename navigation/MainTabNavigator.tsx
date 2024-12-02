import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/HomeScreen';
import WorkoutStackNavigator from './WorkoutStackNavigator';
import ProgressScreen from '../components/progress/ProgressScreen';
import { NavigatorScreenParams } from '@react-navigation/native';
import { WorkoutStackParamList } from './WorkoutStackNavigator';

export type MainTabParamList = {
  Home: undefined;
  Workouts: NavigatorScreenParams<WorkoutStackParamList>;
  Progress: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={{
      headerShown: false, // Hide default headers
    }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Workouts" component={WorkoutStackNavigator} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}
