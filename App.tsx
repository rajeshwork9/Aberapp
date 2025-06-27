import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, Provider as PaperProvider, configureFonts, MD3LightTheme } from 'react-native-paper';


import Login from './src/authentication/Login';
import Dashboard from './src/pages/Dashboard';
import Topup from './src/pages/Topup';

const _fontConfig = {
 default: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: '500',
    }, 
  },
};

const Stack = createNativeStackNavigator();
const fontConfig = {
    ios: _fontConfig,
    android: _fontConfig,
};

const theme = {
  ...DefaultTheme,
  //  fonts: configureFonts({config: fontConfig}),

  colors: {
    ...DefaultTheme.colors,
    primary: '#FF5400',
    background: '#f6f6f6',
  },
};
const App = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
               <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
               <Stack.Screen name="Topup" component={Topup} options={{ headerShown: true, headerTransparent: true, headerTintColor: '#fff', headerTitle: 'Topup', }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>

  );
};


export default App;
