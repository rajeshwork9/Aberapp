import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

interface SessionResponse {
  checkoutUrl: string;
}

const PaymentScreen: React.FC = () => {
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentSession = async () => {
      try {
        const response = await fetch('http://192.168.1.56:3000/create-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: 'ORDER123',
            amount: 50.0,
            currency: 'AED',
          }),
        });
        console.log("Response", response);
        

        if (!response.ok) throw new Error('Failed to create session');

        const data: SessionResponse = await response.json();
        setCheckoutUrl(data.checkoutUrl);
      } catch (error: any) {
        console.error('Session Error:', error);
        Alert.alert('Error', 'Could not initiate payment session');
      }
    };

    createPaymentSession();
  }, []);

  const handleNavigationChange = (navState: any) => {
    const { url } = navState;
    if (url.includes('receipt')) {
      Alert.alert('Success', 'Payment Completed');
    } else if (url.includes('cancel')) {
      Alert.alert('Cancelled', 'Payment was cancelled');
    }
  };

  if (!checkoutUrl) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: checkoutUrl }}
      onNavigationStateChange={handleNavigationChange}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentScreen;
