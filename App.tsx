// App.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

import { navigationRef } from './src/navigation/RootNavigation';

// ------- Screens -------
import Login from './src/authentication/Login';
import Dashboard from './src/pages/Dashboard';
import Topup from './src/pages/Topup';
import Trips from './src/pages/Trips';
import Violations from './src/pages/Violations';
import Vehicles from './src/pages/Vehicles';

/* ──────────────── Auth Context ──────────────── */
type AuthCtx = {
  isLoggedIn: boolean;
  setLoggedIn: (val: boolean) => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside its provider');
  return ctx;
};

/* ──────────────── Navigation Stacks ──────────────── */
// ------- Param Lists -------
type AuthStackParamList = {
  Login: undefined;
};

type MainStackParamList = {
  Dashboard: undefined;
  Topup: undefined;
  Trips: undefined;
  Vehicles: undefined;
  Violations: undefined;
};

export type { AuthStackParamList, MainStackParamList };

// ------- Navigator instances -------
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const MainStackNav = createNativeStackNavigator<MainStackParamList>();
const screenOptions: NativeStackNavigationOptions = { headerShown: false };

export const AuthStack = React.memo(() => (
  <AuthStackNav.Navigator screenOptions={screenOptions}>
    <AuthStackNav.Screen name="Login" component={Login} />
  </AuthStackNav.Navigator>
));

export const MainStack = React.memo(() => (
  <MainStackNav.Navigator screenOptions={screenOptions}>
    <MainStackNav.Screen name="Dashboard" component={Dashboard} />
    <MainStackNav.Screen
      name="Topup"
      component={Topup}
      options={{
        headerShown: true,
        headerTransparent: true,
        headerTintColor: '#fff',
        headerTitle: 'Topup',
      }}
    />
     <MainStackNav.Screen 
      name="Trips" 
      component={Trips} 
      options={{ 
        headerShown: true, 
        headerTransparent: true, 
        headerTintColor: '#fff', 
        headerTitle: 'Trips', 
      }} 
      />
           <MainStackNav.Screen 
      name="Vehicles" 
      component={Vehicles} 
      options={{ 
        headerShown: true, 
        headerTransparent: true, 
        headerTintColor: '#fff', 
        headerTitle: 'Vehicles', 
      }} 
      />
           <MainStackNav.Screen 
      name="Violations" 
      component={Violations} 
      options={{ 
        headerShown: true, 
        headerTransparent: true, 
        headerTintColor: '#fff', 
        headerTitle: 'Violations', 
      }} 
      />
  </MainStackNav.Navigator>
));

/* ──────────────── Theme ──────────────── */
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5400',
    background: '#f6f6f6',
  },
} as const;

/* ──────────────── App Root ──────────────── */
const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Re‑hydrate token once at launch
  useEffect(() => {
    (async () => {
      try {
        const [token, expiry] = await Promise.all([
          AsyncStorage.getItem('accessToken'),
          AsyncStorage.getItem('tokenExpiry'),
        ]);

        const isValid =
          !!token &&
          !!expiry &&
          dayjs(expiry).isValid() &&
          dayjs().isBefore(dayjs(expiry));

        setLoggedIn(isValid);
      } finally {
        setBooting(false);
      }
    })();
  }, []);

  // Stable value to avoid re‑renders of consumers
  const authCtx = useMemo(() => ({ isLoggedIn, setLoggedIn }), [isLoggedIn]);

  // Splash while booting
  if (booting) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authCtx}>
      <PaperProvider theme={theme}>
        <NavigationContainer ref={navigationRef}>
          {isLoggedIn ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
};

export default App;

/* ──────────────── Styles ──────────────── */
const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
