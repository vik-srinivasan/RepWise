import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/WorkoutStackNavigator';
import { useNavigation } from '@react-navigation/native';
import colors from '../../styles/colors';
import { supabase } from '../../services/supabaseClient';

type WorkoutListScreenNavigationProp = NativeStackNavigationProp<
  WorkoutStackParamList,
  'WorkoutList'
>;

export default function WorkoutListScreen() {
  const navigation = useNavigation<WorkoutListScreenNavigationProp>();
  const [workouts, setWorkouts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch workouts from Supabase
    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setWorkouts(data);
      }
    };

    fetchWorkouts();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.type}</Text>
      <Text style={styles.cardText}>
        Duration: {item.duration} minutes
      </Text>
      <Text style={styles.cardText}>
        Sets: {item.sets}, Reps: {item.reps}
      </Text>
      <Text style={styles.cardDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Workouts</Text>
      </View>
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('WorkoutEntry')}
      >
        <Text style={styles.fabIcon}>＋</Text>
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
  },
  headerText: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.lightBlue,
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.darkNavy,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardText: {
    color: colors.darkNavy,
    fontSize: 16,
    marginTop: 4,
  },
  cardDate: {
    color: colors.navy,
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    backgroundColor: colors.navy,
    width: 60,
    height: 60,
    borderRadius: 30,
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    color: colors.offWhite,
    fontSize: 30,
    lineHeight: 30,
  },
});
