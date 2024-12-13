import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../styles/colors';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Welcome back, {user?.email}!</Text>
      </View>

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
      </View>

      {/* Quick Actions Section */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Workouts', { screen: 'WorkoutEntry' })
          }
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

      {/* Motivational Quote Section */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteText}>
          "The secret of getting ahead is getting started."
        </Text>
      </View>

      {/* Sign Out Section */}
      <View style={styles.signOutContainer}>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: colors.lighterNavy,
    padding: 20,
    borderRadius: 8,
  },
  headerText: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  quickActionsContainer: {
    marginVertical: 20,
  },
  button: {
    backgroundColor: colors.navy,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.offWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quoteContainer: {
    marginVertical: 30,
    paddingHorizontal: 20,
  },
  quoteText: {
    color: colors.darkNavy,
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  signOutContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signOutText: {
    color: colors.navy,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
