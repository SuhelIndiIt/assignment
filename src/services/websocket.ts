import { FIXED_SYMBOLS } from './FIXED_SYMBOLS';

export interface PriceData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  timestamp: number;
  isPositive: boolean;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private onMessageCallback: ((data: PriceData[]) => void) | null = null;

  connect(onMessage: (data: PriceData[]) => void) {
    this.onMessageCallback = onMessage;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    try {
      this.ws = new WebSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = event => {
        try {
          const data = JSON.parse(event.data);
          if (Array.isArray(data)) {
            console.log(data);
            const priceData: PriceData[] = data
              .filter((item: any) => {
                const symbol = item.s || '';
                // Only include our fixed symbols
                return FIXED_SYMBOLS.includes(symbol);
              })
              .map((item: any) => ({
                symbol: item.s,
                price: parseFloat(item.c || '0').toFixed(3),
                priceChange: parseFloat(item.p || '0').toFixed(3),
                priceChangePercent: parseFloat(item.P || '0').toFixed(2),
                timestamp: item.E || Date.now(),
                isPositive: parseFloat(item.P || '0') >= 0,
              }));

            if (this.onMessageCallback) {
              this.onMessageCallback(priceData);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = error => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(() => {
        this.connectWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default new WebSocketService();
