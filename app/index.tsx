import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { supabase } from '../supabaseClient';

export default function App() {
  const [message, setMessage] = React.useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('test_table').select('message').single();

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setMessage(data.message);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text>{message ? message : 'Loading message...'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
