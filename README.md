# Crypto Price Tracker

A React Native mobile application that connects to Binance WebSocket API to display real-time cryptocurrency prices with live updates, price charts, and color-coded price changes.

## Features

- 🔌 **Real-time WebSocket Connection** to Binance API
- 📊 **Live Price Updates** for popular cryptocurrencies (BTC, ETH, ADA)
- 🎨 **Color-coded Price Changes** (Green for increases, Red for decreases)
- 📈 **Interactive Price Charts** with line graph visualization
- 📱 **Modern UI** with card-based design and smooth animations
- 🔄 **Auto-reconnection** with exponential backoff
- 📍 **Connection Status Indicator** showing WebSocket state
- ⏰ **Timestamp Display** for each price update

## Screenshots

The app features a clean, modern interface with:

- Real-time price cards with color-coded indicators
- Interactive charts for detailed price analysis
- Connection status indicator
- Smooth transitions between list and chart views

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (>= 18)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- JDK 11 or newer

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd testTask
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install iOS dependencies** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

## Running the Application

### Android

1. **Start Metro bundler**

   ```bash
   npm start
   ```

2. **Run on Android device/emulator**
   ```bash
   npm run android
   ```

### iOS (macOS only)

1. **Start Metro bundler**

   ```bash
   npm start
   ```

2. **Run on iOS simulator/device**
   ```bash
   npm run ios
   ```

## Usage

1. **Launch the app** - The app will automatically connect to Binance WebSocket API
2. **View real-time prices** - See live cryptocurrency prices with color-coded changes
3. **Tap on any price card** - View detailed price chart for that cryptocurrency
4. **Navigate back** - Use the "Back to List" button to return to the price list
5. **Monitor connection** - Check the connection status indicator at the top

## Technical Details

### WebSocket Implementation

- Connects to Binance WebSocket API (`wss://stream.binance.com:9443/ws/!ticker@arr`)
- Filters for popular cryptocurrencies (BTC, ETH, ADA)
- Implements auto-reconnection with exponential backoff
- Handles connection errors gracefully

### Data Structure

```typescript
interface PriceData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  timestamp: number;
  isPositive: boolean;
}
```

### Components

- **WebSocketService**: Handles WebSocket connections and data processing
- **PriceCard**: Displays individual cryptocurrency price information
- **PriceChart**: Shows price data in line chart format
- **ConnectionStatus**: Displays WebSocket connection state

## Dependencies

- `react-native`: Core React Native framework
- `react-native-chart-kit`: For price chart visualization
- `react-native-svg`: Required for chart rendering
- `@react-native-async-storage/async-storage`: For data persistence (future use)
- `react-native-vector-icons`: For UI icons (future use)

## API Reference

The app uses the Binance WebSocket API:

- **Endpoint**: `wss://stream.binance.com:9443/ws/!ticker@arr`
- **Data Format**: 24hr ticker statistics for all symbols
- **Update Frequency**: Real-time updates
- **Rate Limits**: None for public WebSocket streams

## Building APK

To create an APK file for distribution:

1. **Generate a signed APK**

   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. **Find the APK file**
   The APK will be located at:
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**

   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**

   ```bash
   cd android && ./gradlew clean && cd ..
   ```

3. **iOS build issues**

   ```bash
   cd ios && pod deintegrate && pod install && cd ..
   ```

4. **WebSocket connection issues**
   - Check internet connectivity
   - Verify Binance API availability
   - Check firewall settings

### Debug Mode

Enable debug mode by shaking the device or pressing `Cmd+D` (iOS) / `Cmd+M` (Android) to access React Native debug menu.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.

---

**Note**: This application is for educational purposes and uses public APIs. Please ensure compliance with Binance's terms of service when using their API.
