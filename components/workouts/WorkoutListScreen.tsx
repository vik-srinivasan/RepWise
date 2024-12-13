import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/WorkoutStackNavigator';
import { useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

type WorkoutListScreenNavigationProp = NativeStackNavigationProp<
  WorkoutStackParamList,
  'WorkoutList'
>;

export default function WorkoutListScreen() {
  const navigation = useNavigation<WorkoutListScreenNavigationProp>();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<any[]>([]);

  const fetchWorkouts = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('workouts')
      .select('id, name, date, exercises(id, type, set_number, reps, weight, duration)')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      const groupedWorkouts = data.map((workout: any) => ({
        ...workout,
        exercises: workout.exercises.reduce((grouped: any[], exercise: any) => {
          const existingExercise = grouped.find((e: any) => e.type === exercise.type);
          if (existingExercise) {
            existingExercise.sets.push({
              set_number: exercise.set_number,
              reps: exercise.reps,
              weight: exercise.weight,
              duration: exercise.duration,
            });
          } else {
            grouped.push({
              type: exercise.type,
              sets: [
                {
                  set_number: exercise.set_number,
                  reps: exercise.reps,
                  weight: exercise.weight,
                  duration: exercise.duration,
                },
              ],
            });
          }
          return grouped;
        }, []),
      }));

      setWorkouts(groupedWorkouts);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkouts(); // Fetch data whenever the screen is focused
    }, [user])
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.exercises.length > 0 ? (
        item.exercises.map((exercise: any, index: number) => (
          <View key={index} style={styles.exerciseContainer}>
            <Text style={styles.exerciseTitle}>{exercise.type}</Text>
            {exercise.sets.map((set: any, setIndex: number) => (
              <Text key={setIndex} style={styles.setDetails}>
                Set {set.set_number}: {set.reps || 0} reps, {set.weight || 0} lbs, {set.duration || 0} mins
              </Text>
            ))}
          </View>
        ))
      ) : (
        <Text style={styles.cardText}>No exercises recorded</Text>
      )}
      <Text style={styles.cardDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Workouts</Text>
      </View>
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('WorkoutEntry')}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: 16,
  },
  header: {
    backgroundColor: colors.lighterNavy,
    padding: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  headerText: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.lightBlue,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.darkNavy,
    fontSize: 20,
    fontWeight: 'bold',
  },
  exerciseContainer: {
    marginTop: 8,
  },
  exerciseTitle: {
    color: colors.darkNavy,
    fontSize: 16,
    fontWeight: 'bold',
  },
  setDetails: {
    color: colors.navy,
    fontSize: 14,
    marginLeft: 16,
  },
  cardDate: {
    color: colors.navy,
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    backgroundColor: colors.navy,
    width: 60,
    height: 60,
    borderRadius: 30,
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: colors.offWhite,
    fontSize: 30,
    lineHeight: 30,
  },
  cardText: {
    color: colors.navy,
    fontSize: 16,
    marginTop: 8,
  },
});
