import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { CompositeNavigationProp, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/MainTabNavigator';
import { WorkoutStackParamList } from '../../navigation/WorkoutStackNavigator';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../styles/colors';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

type WorkoutEntryNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<WorkoutStackParamList, 'WorkoutEntry'>,
  NativeStackNavigationProp<MainTabParamList>
>;

type WorkoutEntryRouteProp = RouteProp<WorkoutStackParamList, 'WorkoutEntry'>;

export default function WorkoutEntryScreen() {
  const navigation = useNavigation<WorkoutEntryNavigationProp>();
  const route = useRoute<WorkoutEntryRouteProp>();
  const { user } = useAuth();

  const { generatedWorkout, workoutFocus } = route.params || {}; // Access parameters

  const [workoutName, setWorkoutName] = useState(workoutFocus || ''); // Use workoutFocus as default
  const [exercises, setExercises] = useState<any[]>(generatedWorkout || []); // Initialize with generatedWorkout
  const [exerciseType, setExerciseType] = useState('');
  const [duration, setDuration] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const addExercise = () => {
    if (!exerciseType) {
      Alert.alert('Error', 'Exercise type is required.');
      return;
    }

    if (!sets || Number(sets) <= 0) {
      Alert.alert('Error', 'You must add at least one set.');
      return;
    }

    const setsArray = Array.from({ length: Number(sets) }, (_, index) => ({
      setNumber: index + 1,
      reps: reps ? Number(reps) : null,
      weight: weight ? Number(weight) : null,
      duration: duration ? Number(duration) : null,
    }));

    setExercises((prev) => [
      ...prev,
      { type: exerciseType, sets: setsArray },
    ]);

    setExerciseType('');
    setDuration('');
    setSets('');
    setReps('');
    setWeight('');
  };

  const updateSetValue = (
    exerciseIndex: number,
    setIndex: number,
    key: 'reps' | 'weight' | 'duration',
    value: string
  ) => {
    setExercises((prev) => {
      const updatedExercises = [...prev];
      updatedExercises[exerciseIndex].sets[setIndex][key] = value
        ? parseInt(value, 10)
        : null;
      return updatedExercises;
    });
  };

  const handleSaveWorkout = async () => {
    if (!workoutName || exercises.length === 0) {
      Alert.alert('Error', 'Workout name and at least one exercise and set are required.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No authenticated user found.');
      return;
    }

    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .insert([{ user_id: user.id, name: workoutName }])
      .select('id')
      .single();

    if (workoutError) {
      Alert.alert('Error', workoutError.message);
      return;
    }

    const { error: exerciseError } = await supabase
      .from('exercises')
      .insert(
        exercises.flatMap((exercise) =>
          exercise.sets.map((set: any) => ({
            workout_id: workout.id,
            type: exercise.type,
            set_number: set.setNumber,
            reps: set.reps,
            weight: set.weight,
            duration: set.duration,
          }))
        )
      );

    if (exerciseError) {
      Alert.alert('Error', exerciseError.message);
    } else {
      Alert.alert('Success', 'Workout saved successfully!');
      navigation.navigate('WorkoutList');
    }
  };

  const renderSetRow = (
    exerciseIndex: number,
    set: any,
    setIndex: number
  ) => (
    <View key={setIndex} style={styles.setRow}>
      <Text style={styles.setLabel}>Set {set.setNumber}:</Text>
      <TextInput
        style={styles.setInput}
        placeholder="Reps"
        keyboardType="numeric"
        value={set.reps?.toString() || ''}
        onChangeText={(text) =>
          updateSetValue(exerciseIndex, setIndex, 'reps', text)
        }
      />
      <TextInput
        style={styles.setInput}
        placeholder="Weight"
        keyboardType="numeric"
        value={set.weight?.toString() || ''}
        onChangeText={(text) =>
          updateSetValue(exerciseIndex, setIndex, 'weight', text)
        }
      />
      <TextInput
        style={styles.setInput}
        placeholder="Duration"
        keyboardType="numeric"
        value={set.duration?.toString() || ''}
        onChangeText={(text) =>
          updateSetValue(exerciseIndex, setIndex, 'duration', text)
        }
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('WorkoutList')}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.offWhite} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {generatedWorkout ? 'AI-Generated Workout' : 'New Workout'}
        </Text>
      </View>
      <TextInput
        placeholder="Workout Name"
        value={workoutName}
        onChangeText={setWorkoutName}
        style={[
          styles.input,
          !workoutName ? styles.requiredInput : {},
        ]}
      />
      <TextInput
      placeholder="Exercise Type"
      value={exerciseType}
      onChangeText={setExerciseType}
      style={[
        styles.input,
        !exerciseType ? styles.requiredInput : {},
      ]}
      />
      <TextInput
        placeholder="Sets Count"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
        style={[
          styles.input,
          !sets ? styles.requiredInput : {},
        ]}
      />
      <TouchableOpacity style={styles.addButton} onPress={addExercise}>
        <Text style={styles.addButtonText}>Add Exercise</Text>
      </TouchableOpacity>
      <FlatList
        data={exercises}
        renderItem={({ item, index: exerciseIndex }) => (
          <View style={styles.exerciseItem}>
            <Text style={styles.exerciseTitle}>{item.type}</Text>
            {item.sets.map((set: any, setIndex: number) =>
              renderSetRow(exerciseIndex, set, setIndex)
            )}
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveWorkout}>
        <Text style={styles.saveButtonText}>Save Workout</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lighterNavy,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  backButton: {
    marginRight: 12,
  },
  headerText: {
    fontSize: 20,
    color: colors.offWhite,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: colors.lightBlue,
    marginVertical: 8,
    padding: 12,
    borderRadius: 4,
    color: colors.lighterNavy,
  },
  requiredInput: {
    backgroundColor: colors.lightBlue, // Highlighted color for required fields
    color: colors.lighterNavy, // Ensure text remains readable
  },
  addButton: {
    backgroundColor: colors.navy,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 8,
  },
  addButtonText: {
    color: colors.offWhite,
    fontSize: 16,
  },
  exerciseItem: {
    backgroundColor: colors.lightBlue,
    padding: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.darkNavy,
    marginBottom: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setLabel: {
    fontSize: 14,
    color: colors.darkNavy,
    marginRight: 8,
  },
  setInput: {
    backgroundColor: colors.offWhite,
    padding: 6,
    borderRadius: 4,
    width: 60,
    marginHorizontal: 4,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: colors.lighterNavy,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: colors.offWhite,
    fontSize: 18,
  },
});