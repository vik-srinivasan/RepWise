import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome back, {user?.email}!</Text>
      </View>
      <View style={styles.quickActions}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
            navigation.navigate('Workouts', {
            screen: 'WorkoutEntry', // Navigate to the WorkoutEntry screen within Workouts
            });
        }}
        >
        <Text style={styles.buttonText}>Log a Workout</Text>
      </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Progress')}
        >
          <Text style={styles.buttonText}>View Progress</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.motivationalQuote}>
        <Text style={styles.quoteText}>
          "The secret of getting ahead is getting started."
        </Text>
      </View>
      <TouchableOpacity onPress={signOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
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
  },
  headerText: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickActions: {
    marginTop: 30,
    alignItems: 'center',
  },
  button: {
    backgroundColor: colors.navy,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: colors.offWhite,
    fontSize: 18,
  },
  motivationalQuote: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  quoteText: {
    color: colors.darkNavy,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  signOutText: {
    color: colors.navy,
    textAlign: 'center',
    marginTop: 30,
    textDecorationLine: 'underline',
  },
});