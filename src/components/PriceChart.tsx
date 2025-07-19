import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

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

  const current = parseFloat(data[data.length - 1].price);
  const previous = parseFloat(data[data.length - 2].price);
  const change = ((current - previous) / previous) * 100;

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
      <View style={styles.priceChangeContainer}>
        <Text style={styles.changeTxt}>Previous Price : {previous}</Text>
        <Text style={styles.changeTxt}>Current Price : {current}</Text>
        <Text style={styles.changeTxt}>Price Diff : {change}%</Text>
      </View>

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
    paddingTop: 6,
  },
  priceChangeContainer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  changeTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 3,
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
