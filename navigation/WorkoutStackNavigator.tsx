import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutListScreen from '../components/workouts/WorkoutListScreen';
import WorkoutEntryScreen from '../components/workouts/WorkoutEntryScreen';

export type WorkoutStackParamList = {
  WorkoutList: undefined;
  WorkoutEntry: undefined;
};

const Stack = createNativeStackNavigator<WorkoutStackParamList>();

export default function WorkoutStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="WorkoutList">
      <Stack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: 'My Workouts' }} />
      <Stack.Screen name="WorkoutEntry" component={WorkoutEntryScreen} options={{ title: 'New Workout' }} />
    </Stack.Navigator>
  );
}
