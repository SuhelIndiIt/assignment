import { StyleSheet, Text, View } from 'react-native';

import { PriceData } from '../services/websocket';
import React from 'react';

interface PriceCardProps {
  data: PriceData;
}

const PriceCard: React.FC<PriceCardProps> = ({ data }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: data.isPositive ? '#4CAF50' : '#F44336' },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.symbol}>{data.symbol}</Text>
        <Text style={styles.time}>{formatTime(data.timestamp)}</Text>
      </View>

      <Text style={styles.price}>${parseFloat(data.price).toFixed(8)}</Text>

      <View style={styles.priceContainer}>
        <Text
          style={[
            styles.change,
            { color: data.isPositive ? '#4CAF50' : '#F44336' },
          ]}
        >
          {data.isPositive ? '+' : ''}
          {data.priceChange}
        </Text>

        <View
          style={[
            styles.changeContainer,
            { backgroundColor: data.isPositive ? '#4CAF50' : '#F44336' },
          ]}
        >
          <Text style={styles.changeText}>
            {data.isPositive ? '+' : ''}
            {data.priceChangePercent}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
  },
  header: {
    marginBottom: 8,
  },
  symbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  changeContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  changeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default PriceCard;
