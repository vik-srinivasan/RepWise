import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import colors from '../../styles/colors';
import { supabase } from '../../services/supabaseClient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainTabParamList } from '../../navigation/MainTabNavigator';

type AIWorkoutNavigationProp = NativeStackNavigationProp<
  MainTabParamList,
  'Generate'
>;


const parseGeneratedWorkout = (rawContent: string): any[] => {
    try {
      // Remove potential formatting artifacts like backticks
      const sanitizedContent = rawContent.replace(/```json|```/g, '').trim();
      return JSON.parse(sanitizedContent);
    } catch (error) {
      console.error('Failed to parse generated workout:', error);
      throw new Error('Content is not valid JSON.');
    }
  };
  

export default function AIWorkoutScreen() {
    const navigation = useNavigation<AIWorkoutNavigationProp>();
    const [workoutFocus, setWorkoutFocus] = useState('');
    const [exercisePreferences, setExercisePreferences] = useState('');
    const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
    const [loading, setLoading] = useState(false); // Loading state

// Interfaces for fetched data
interface Exercise {
    type: string;
    set_number: number;
    reps: number | null;
    weight: number | null;
    duration: number | null;
  }
  
  interface Workout {
    id: number;
    name: string;
    date: string;
    exercises: Exercise[];
  }
  
  // Interfaces for transformed data
  interface GroupedExercise {
    type: string;
    sets: {
      set_number: number;
      reps: number | null;
      weight: number | null;
      duration: number | null;
    }[];
  }
  
  interface TransformedWorkout {
    id: number;
    name: string;
    date: string;
    exercises: GroupedExercise[];
  }
  
  // Fetch and transform workout data
  const fetchWorkoutHistory = async (): Promise<TransformedWorkout[]> => {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('id, name, date, exercises(type, set_number, reps, weight, duration)')
        .order('date', { ascending: false });
  
      if (error) {
        console.error(error);
        throw new Error('Failed to fetch workout history.');
      }
  
      // Transform data into grouped format
      return (data as Workout[]).map((workout) => ({
        ...workout,
        exercises: workout.exercises.reduce<GroupedExercise[]>((grouped, exercise) => {
          const existing = grouped.find((e) => e.type === exercise.type);
          if (existing) {
            existing.sets.push({
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
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  

  const generateWorkout = async () => {
    setLoading(true);
  
    try {
      // Fetch the workout history
      const workoutHistory = await fetchWorkoutHistory();
  
      // Prepare payload for Gemini API
      const payload = {
        contents: [
          {
            parts: [
              {
                text: `
                    Generate a full workout for the following user based on their workout history, workout focus, and exercise preferences:

                    - Workout Focus: ${workoutFocus || 'None'}
                    - Exercise Preferences: ${exercisePreferences || 'None'}
                    - Workout History: ${JSON.stringify(workoutHistory)}

                    Requirements:
                    1. Include at least four exercises, even if no exercise preferences are provided.
                    2. For each exercise, aim for slight progression compared to the user's workout history (e.g., increased weight, reps, or duration where appropriate).
                    3. If no workout history is available, generate a balanced workout suitable for a general fitness goal.

                    Respond **only** with valid JSON in the following format:
                    [
                        {
                            "type": "string",
                            "sets": [
                            {
                                "set_number": "number",
                                "reps": "number",
                                "weight": "number",
                                "duration": "number|null"
                            }
                            ]
                        }
                    ]
                `,
              },
            ],
          },
        ],
      };
  
      // Call Gemini API
      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCMkMf6t8oDriwGPZ_evA4CY7KavAYwpAs',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('API Error Details:', errorDetails);
        throw new Error(`API Error: ${errorDetails.error.message}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      // Extract the candidate and content
      const candidate = data.candidates?.[0];
      if (!candidate) {
        throw new Error('No candidates in the API response.');
      }
      
      const content = candidate.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('No valid content in the response.');
      }
      
      // Parse the workout using the helper function
      const generatedWorkout = parseGeneratedWorkout(content);
      
      if (!Array.isArray(generatedWorkout) || generatedWorkout.length === 0) {
        throw new Error('Generated workout is not in the expected format.');
      }
      
      setGeneratedWorkout(generatedWorkout);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Generate an AI Workout</Text>
      </View>

      {/* Instructions */}
        <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
            Enter your preferences below, and AI will generate a personalized workout. It considers your preferences, workout focus, and past workout history to create a balanced, progressive routine. You can then create a new workout using the generated exercises.
        </Text>
        </View>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Optionally, enter a workout focus (e.g., Chest)"
          value={workoutFocus}
          onChangeText={setWorkoutFocus}
          placeholderTextColor={colors.navy}
        />
        <TextInput
          style={styles.input}
          placeholder="Optionally, enter any exercise preferences (e.g., Push Ups)"
          value={exercisePreferences}
          onChangeText={setExercisePreferences}
          placeholderTextColor={colors.navy}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: colors.lightBlue }]}
        onPress={generateWorkout}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Generating...' : 'Generate Workout'}
        </Text>
      </TouchableOpacity>

      {/* Display Generated Workout */}
      {generatedWorkout && (
        <View style={styles.generatedWorkoutContainer}>
          <Text style={styles.generatedWorkoutHeader}>Generated Workout</Text>
          {generatedWorkout.map((exercise: any, index: number) => (
            <View key={index} style={styles.exerciseContainer}>
              <Text style={styles.exerciseType}>{exercise.type}</Text>
              {exercise.sets.map((set: any, setIndex: number) => (
                <Text key={setIndex} style={styles.setDetails}>
                  Set {set.set_number}: {set.reps || 0} reps, {set.weight || 0} lbs, {set.duration || 0} mins
                </Text>
              ))}
            </View>
          ))}
          {/* Create Workout Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={() =>
                navigation.navigate('Workouts', {
                screen: 'WorkoutEntry',
                params: { generatedWorkout },
                })
            }
            >
            <Text style={styles.createButtonText}>Create New Workout</Text>
            </TouchableOpacity>
        </View>
      )}
    </ScrollView>
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
  instructionsContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: colors.darkNavy,
    textAlign: 'left',
    lineHeight: 20,
  },  
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.lightBlue,
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: colors.darkNavy,
  },
  button: {
    backgroundColor: colors.navy,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 2,
  },
  buttonText: {
    color: colors.offWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  generatedWorkoutContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
  },
  generatedWorkoutHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkNavy,
    marginBottom: 10,
  },
  exerciseContainer: {
    marginBottom: 10,
  },
  exerciseType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.navy,
  },
  setDetails: {
    fontSize: 14,
    color: colors.darkNavy,
  },
  createButton: {
    backgroundColor: colors.navy,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  createButtonText: {
    color: colors.offWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
