import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutListScreen from '../components/workouts/WorkoutListScreen';
import WorkoutEntryScreen from '../components/workouts/WorkoutEntryScreen';

export type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutEntry: { 
    generatedWorkout?: any; 
    workoutFocus?: string; 
  }; 
  AIWorkout: { 
    triggerGenerate?: boolean; // Add this parameter for auto-generation
  };
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export default function WorkoutStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="WorkoutList"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="WorkoutList"
        component={WorkoutListScreen}
      />
      <Stack.Screen
        name="WorkoutEntry"
        component={WorkoutEntryScreen}
      />
    </Stack.Navigator>
  );
}
