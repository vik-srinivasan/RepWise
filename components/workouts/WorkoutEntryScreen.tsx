import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
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

export default function WorkoutEntryScreen() {
  const navigation = useNavigation<WorkoutEntryNavigationProp>();
  const { user } = useAuth(); // Fetch authenticated user
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleSave = async () => {
    if (!type || !duration) {
      Alert.alert('Please fill in all required fields.');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'No authenticated user found.');
      return;
    }

    // Insert workout data into Supabase
    const { error } = await supabase.from('workouts').insert([
      {
        user_id: user.id, // Associate workout with the authenticated user
        type,
        duration: Number(duration),
        sets: sets ? Number(sets) : null,
        reps: reps ? Number(reps) : null,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.navigate('Workouts', { screen: 'WorkoutList' }); // Navigate back to WorkoutList
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Workouts', { screen: 'WorkoutList' })}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.offWhite} />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Workout</Text>
      </View>
      <TextInput
        placeholder="Workout Type"
        value={type}
        onChangeText={setType}
        style={styles.input}
      />
      <TextInput
        placeholder="Duration (mins)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Sets (optional)"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps (optional)"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
        style={styles.input}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    padding: 20,
    marginBottom: 12,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {
    fontSize: 24,
    color: colors.offWhite,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.lightBlue,
    marginVertical: 8,
    padding: 12,
    borderRadius: 4,
    color: colors.darkNavy,
  },
  saveButton: {
    backgroundColor: colors.navy,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.offWhite,
    fontSize: 18,
  },
});
