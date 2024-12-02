import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import colors from '../../styles/colors';
import { supabase } from '../../services/supabaseClient';

export default function ProgressScreen() {
  const [workoutData, setWorkoutData] = useState<any[]>([]);
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    // Fetch workout data from Supabase
    const fetchWorkoutData = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .order('date', { ascending: true });
      if (error) {
        console.error(error);
      } else {
        setWorkoutData(data);
      }
    };

    fetchWorkoutData();
  }, []);

  // Prepare data for charts
  const lineChartData = {
    labels: workoutData.map((w) => new Date(w.date).toLocaleDateString()),
    datasets: [
      {
        data: workoutData.map((w) => w.duration),
        color: () => colors.navy,
      },
    ],
  };

  const barChartData = {
    labels: workoutData.map((w) => new Date(w.date).toLocaleDateString()),
    datasets: [
      {
        data: workoutData.map((w) => w.sets),
      },
    ],
  };

  const workoutTypes = Array.from(
    new Set(workoutData.map((w) => w.type))
  );

  const pieChartData = workoutTypes.map((type, index) => {
    const count = workoutData.filter((w) => w.type === type).length;
    return {
      name: type,
      population: count,
      color: index % 2 === 0 ? colors.lightBlue : colors.lighterNavy,
      legendFontColor: colors.darkNavy,
      legendFontSize: 15,
    };
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Progress</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.chartTitle}>Workout Duration Over Time</Text>
        <LineChart
          data={lineChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Sets Over Time</Text>
        <BarChart
          data={barChartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          style={styles.chart}
        />
        <Text style={styles.chartTitle}>Workout Types</Text>
        <PieChart
          data={pieChartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
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
  },
  headerText: {
    color: colors.offWhite,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  chartTitle: {
    color: colors.darkNavy,
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
