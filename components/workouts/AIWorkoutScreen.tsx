import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import colors from '../../styles/colors';

export default function AIWorkoutScreen() {
  const [workoutFocus, setWorkoutFocus] = useState('');
  const [exercisePreferences, setExercisePreferences] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Generate an AI Workout</Text>
      </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter workout focus (e.g., Chest)"
          value={workoutFocus}
          onChangeText={setWorkoutFocus}
          placeholderTextColor={colors.navy}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter exercise preferences (e.g., Push Ups)"
          value={exercisePreferences}
          onChangeText={setExercisePreferences}
          placeholderTextColor={colors.navy}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Generate Workout</Text>
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
    marginBottom: 20,
  },
  headerText: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.lightBlue,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.darkNavy,
  },
  button: {
    backgroundColor: colors.navy,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.offWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
