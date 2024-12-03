import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import colors from '../../styles/colors';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    } else {
      Alert.alert('Welcome!', 'You have successfully logged in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
        keyboardType="email-address"
        placeholderTextColor={colors.navy}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor={colors.navy}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? <Text style={styles.linkText}>Sign up</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.offWhite,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkNavy,
    textAlign: 'center',
    marginBottom: 24,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.lightBlue,
    marginVertical: 8,
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    color: colors.darkNavy,
  },
  button: {
    backgroundColor: colors.navy,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: colors.offWhite,
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: colors.navy,
  },
  linkText: {
    color: colors.lighterNavy,
    fontWeight: 'bold',
  },
});