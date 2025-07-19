import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import WebSocketService, { PriceData } from '../services/websocket';

import ConnectionStatus from '../components/ConnectionStatus';
import { FIXED_SYMBOLS } from '../services/FIXED_SYMBOLS';
import PriceCard from '../components/PriceCard';
import PriceChart from '../components/PriceChart';

const CryptoTracker = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [selectedPriceData, setSelectedPriceData] = useState<PriceData[]>([]);
  const priceHistoryRef = useRef<Map<string, PriceData[]>>(new Map());
  const priceDataMapRef = useRef<Map<string, PriceData>>(new Map());

  useEffect(() => {
    connectWebSocket();
    return () => {
      WebSocketService.disconnect();
    };
  }, []);

  const connectWebSocket = () => {
    try {
      WebSocketService.connect((data: PriceData[]) => {
        // Store all price data in a map for quick lookup
        data.forEach(item => {
          priceDataMapRef.current.set(item.symbol, item);
        });

        // Create fixed order list with current prices
        const fixedPriceData = FIXED_SYMBOLS.map(symbol => {
          const currentData = priceDataMapRef.current.get(symbol);
          return (
            currentData || {
              symbol,
              price: '0.00',
              priceChange: '0.00',
              priceChangePercent: '0.00',
              timestamp: Date.now(),
              isPositive: false,
            }
          );
        });

        setPriceData(fixedPriceData);
        setIsConnected(true);

        // Update price history for charts
        data.forEach(item => {
          if (!priceHistoryRef.current.has(item.symbol)) {
            priceHistoryRef.current.set(item.symbol, []);
          }
          const history = priceHistoryRef.current.get(item.symbol)!;
          history.push(item);
          if (history.length > 50) {
            history.shift();
          }
        });
      });
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      Alert.alert('Connection Error', 'Failed to connect to WebSocket');
    }
  };

  const handleSymbolPress = (item: PriceData) => {
    setSelectedSymbol(item.symbol);
    const symbolHistory = priceHistoryRef.current.get(item.symbol) || [];
    setSelectedPriceData(symbolHistory);
    setShowChartModal(true);
  };

  const renderPriceCard = ({ item }: { item: PriceData }) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => handleSymbolPress(item)}
      style={styles.cardContainer}
    >
      <PriceCard data={item} />
    </TouchableOpacity>
  );

  const renderChart = () => {
    if (!selectedSymbol || selectedPriceData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={styles.debugText}>
            No chart data available for {selectedSymbol}
          </Text>
        </View>
      );
    }

    console.log('Chart data:', selectedPriceData);
    return <PriceChart data={selectedPriceData} symbol={selectedSymbol} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <View style={[styles.header, { paddingTop: StatusBar.currentHeight }]}>
        <Text style={styles.title}>Crypto Price Tracker</Text>
        <ConnectionStatus isConnected={isConnected} />
      </View>

      <Modal
        visible={showChartModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowChartModal(false)}
        transparent={true}
      >
        <SafeAreaView style={styles.modalWrapper}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text>{selectedSymbol} Chart</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowChartModal(false)}
              >
                <Text>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>{renderChart()}</View>
          </View>
        </SafeAreaView>
      </Modal>

      <FlatList
        data={priceData}
        renderItem={renderPriceCard}
        keyExtractor={item => item.symbol}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isConnected ? 'Loading prices...' : 'Connecting to WebSocket...'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  listContainer: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  row: {
    justifyContent: 'space-between',
  },
  cardContainer: {
    flex: 1,
    margin: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 15,
  },
  modalContainer: {
    height: '40%',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#cccccc',
  },
  chartContainer: {
    flex: 1,
    padding: 8,
  },
  debugText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default CryptoTracker;
