import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import colors from '../../styles/colors';
import { supabase } from '../../services/supabaseClient';

export default function ProgressScreen() {
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const screenWidth = Dimensions.get('window').width;

  const fetchWorkoutData = async () => {
    const { data, error } = await supabase
        .from('exercises')
        .select('type, set_number, reps, weight, duration, workout_id, created_at')
        .order('workout_id', { ascending: true })
        .order('set_number', { ascending: true });
  

    if (error) {
      console.error(error);
    } else {
      setWorkoutData(data);
      if (data.length > 0) {
        setSelectedExercise(data[0].type); // Set default exercise
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchWorkoutData(); // Fetch data whenever the screen is focused
    }, [])
  );

  const exerciseTypes = Array.from(new Set(workoutData.map((w) => w.type)));
  const filteredData = workoutData.filter(
    (exercise) => exercise.type === selectedExercise
  );

  const lineChartData = (key: 'weight' | 'reps' | 'duration') => {
    if (filteredData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [0],
            color: () => colors.navy,
          },
        ],
      };
    }
  
    // Reverse the filtered data to show the most recent sets first
    const reversedData = [...filteredData].reverse();
  
    return {
      labels: reversedData.map((exercise) => {
        const date = new Date(exercise.created_at).toLocaleDateString(); // Format the created_at date
        return `${exercise.set_number} - ${date}`; // Combine Set # and date
      }),
      datasets: [
        {
          data: reversedData.map((exercise) => {
            const value = exercise[key];
            return value !== null && value !== undefined ? value : 0;
          }),
          color: () => colors.navy,
        },
      ],
    };
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Progress</Text>
      </View>

      {/* Exercise Filter */}
      <FlatList
        data={exerciseTypes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedExercise === item && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedExercise(item)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedExercise === item && styles.filterButtonTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.filterContainer}
      />

      {/* Weight Over Time */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weight Over Time</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={styles.scrollableChartContainer}
        >
          <View
            style={[
              styles.chartBackground,
              { width: Math.max(screenWidth, filteredData.length * 100) },
            ]}
          >
            <LineChart
              data={lineChartData('weight')}
              width={Math.max(screenWidth, filteredData.length * 100)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </ScrollView>
      </View>

      {/* Reps Over Time */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Reps Over Time</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={styles.scrollableChartContainer}
        >
          <View
            style={[
              styles.chartBackground,
              { width: Math.max(screenWidth, filteredData.length * 100) },
            ]}
          >
            <LineChart
              data={lineChartData('reps')}
              width={Math.max(screenWidth, filteredData.length * 100)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </ScrollView>
      </View>

      {/* Duration Over Time */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Duration Over Time</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator
          style={styles.scrollableChartContainer}
        >
          <View
            style={[
              styles.chartBackground,
              { width: Math.max(screenWidth, filteredData.length * 100) },
            ]}
          >
            <LineChart
              data={lineChartData('duration')}
              width={Math.max(screenWidth, filteredData.length * 100)}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const chartConfig = {
  backgroundGradientFrom: colors.offWhite,
  backgroundGradientTo: colors.offWhite,
  color: (opacity = 1) => colors.navy,
  labelColor: () => colors.darkNavy,
  decimalPlaces: 0,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: colors.navy,
  },
};

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
  },
  headerText: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  filterButton: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.navy,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.darkNavy,
  },
  filterButtonTextActive: {
    color: colors.offWhite,
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkNavy,
    marginBottom: 8,
    textAlign: 'center',
  },
  scrollableChartContainer: {
    flex: 1,
    backgroundColor: colors.lightBlue,
    borderRadius: 8,
  },
  chartBackground: {
    backgroundColor: colors.offWhite,
    justifyContent: 'center',
    borderRadius: 8,
  },
  chart: {
    borderRadius: 16,
  },
});
