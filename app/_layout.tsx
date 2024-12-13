import { SafeAreaView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', // Set your desired background color
  },
});