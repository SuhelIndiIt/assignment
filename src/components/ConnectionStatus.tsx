import { StyleSheet, Text, View } from 'react-native';

import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isConnected ? '#4CAF50' : '#F44336' },
      ]}
    >
      <View
        style={[
          styles.indicator,
          { backgroundColor: isConnected ? '#2E7D32' : '#D32F2F' },
        ]}
      />
      <Text style={styles.text}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ConnectionStatus;
