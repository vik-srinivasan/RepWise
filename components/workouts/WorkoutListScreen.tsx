import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WorkoutStackParamList } from '../../navigation/WorkoutStackNavigator';

type WorkoutListScreenNavigationProp = NativeStackNavigationProp<
  WorkoutStackParamList,
  'WorkoutList'
>;

export default function WorkoutListScreen() {
  const navigation = useNavigation<WorkoutListScreenNavigationProp>();

  // Placeholder data for workouts
  const workouts = [
    { id: '1', type: 'Running', duration: '30 mins' },
    { id: '2', type: 'Cycling', duration: '45 mins' },
  ];

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{`${item.type} - ${item.duration}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Add Workout"
        onPress={() => navigation.navigate('WorkoutEntry')}
      />
      <FlatList
        data={workouts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    marginTop: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
});
