import { Dimensions, StyleSheet, Text, View } from 'react-native';

import { LineChart } from 'react-native-chart-kit';
import { PriceData } from '../services/websocket';
import React from 'react';

interface PriceChartProps {
  data: PriceData[];
  symbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ data, symbol }) => {
  if (data.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{symbol} Price Chart</Text>
        <Text style={styles.noData}>Insufficient data for chart</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  const modalWrapperPadding = 40;
  const chartContainerPadding = 32;
  const chartWidth = screenWidth - modalWrapperPadding - chartContainerPadding;

  const chartData = {
    labels: data.slice(-10).map((_, index) => `${index + 1}`),
    datasets: [
      {
        data: data.slice(-10).map(item => parseFloat(item.price)),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          decimalPlaces: 8,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '3',
            strokeWidth: '1',
            stroke: '#4CAF50',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default PriceChart;
