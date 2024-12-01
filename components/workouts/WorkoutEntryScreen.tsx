import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WorkoutEntryScreen() {
  const navigation = useNavigation();
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');

  const handleSave = () => {
    // TODO: Save the workout data to Supabase
    // For now, just navigate back to the workout list
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Workout</Text>
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
        placeholder="Sets"
        value={sets}
        onChangeText={setSets}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Reps"
        value={reps}
        onChangeText={setReps}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Save Workout" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginVertical: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 4,
  },
});
