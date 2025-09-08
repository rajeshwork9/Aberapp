import React, { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import axios from 'axios';
import { createSession } from '../services/payment'; 

const HostedCheckoutScreen: React.FC = () => {
  const webViewRef = useRef<WebView>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const amount = '10.00';
  const orderId = `ORDER-${Date.now()}`;

  useEffect(() => {
    createSessionAndLoadCheckout();
  }, []);

  const createSessionAndLoadCheckout = async () => {
    try {
      const response = await createSession(amount, orderId);
      console.log(response);
      

      const sessionId = response.session?.id;

      if (!sessionId) throw new Error('Session ID not received');

      const version = 61;
      const url = `https://test-rakbankpay.mtf.gateway.mastercard.com/checkout/version/${version}/checkout.html?sessionId=${sessionId}`;
      setCheckoutUrl(url);
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Failed to load payment page');
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;

    if (url.includes('resultIndicator')) {
      Alert.alert('Payment Success', 'Transaction complete!');
    }

    if (url.includes('cancel') || url.includes('fail')) {
      Alert.alert('Payment Cancelled or Failed', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {loading || !checkoutUrl ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <WebView
          ref={webViewRef}
          source={{ uri: checkoutUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState
          renderLoading={() => <ActivityIndicator size="large" color="#007AFF" />}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['*']}
        />
      )}
    </View>
  );
};

export default HostedCheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
